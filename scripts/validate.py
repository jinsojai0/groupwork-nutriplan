"""ตรวจสอบความถูกต้องของ Master Dataset โครงงาน NutriPlan ตามกฎ 14 ข้อ (ตารางที่ 5.2 ในรายงานงานที่ 4)

วิธีใช้ (รันจากโฟลเดอร์โครงงาน GroupWork_NutriPlan):
    python doc/validate.py
อ่านไฟล์ CSV ทุกชีตจาก data/csv/ และตรวจไฟล์ภาพเทียบกับโฟลเดอร์ images/
"""
import csv, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_DIR = os.path.join(ROOT, "data", "csv")

def load(name):
    with open(os.path.join(CSV_DIR, name + ".csv"), encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))

def split(v, sep="|"):
    return [s.strip() for s in v.split(sep) if s.strip()]

menus, cats, vendors = load("menus"), load("categories"), load("vendor_types")
articles, limits, sources = load("articles"), load("nutrient_limits"), load("sources")
users, logs = load("users"), load("meal_logs")
src_ids = {r["source_id"] for r in sources}
art_ids = {r["article_id"] for r in articles}
menu_ids = {r["menu_id"] for r in menus}
user_ids = {r["user_id"] for r in users}

rules = []  # (no, description, list of errors)

def rule(no, desc, errors):
    rules.append((no, desc, errors))

# 1 menu_id ไม่ซ้ำและตรงรูปแบบ
ids = [r["menu_id"] for r in menus]
rule(1, "menu_id ไม่ซ้ำและตรงรูปแบบ ^menu_\\d{3}$",
     [i for i in ids if not re.fullmatch(r"menu_\d{3}", i)] + [i for i in set(ids) if ids.count(i) > 1])
# 2 Foreign Key หมวดและประเภทร้าน
cat_ids = {r["category_id"] for r in cats}; ven_ids = {r["vendor_type_id"] for r in vendors}
rule(2, "category_id และ vendor_type_id ของทุกเมนูต้องมีอยู่จริง",
     [r["menu_id"] for r in menus if r["category_id"] not in cat_ids or r["vendor_type_id"] not in ven_ids])
# 3 พลังงานสอดคล้องกับสารอาหารหลัก ±8%
# ยอมรับสูตร Atwater (4P+9F+4C) หรือสูตรของ Thai FCD (4P+9F+4C+2×ใยอาหาร) อย่างใดอย่างหนึ่ง
def energy_bad(r):
    e = float(r["energy_kcal"]); calc = 4*float(r["protein_g"]) + 9*float(r["fat_g"]) + 4*float(r["carb_g"])
    calc2 = calc + 2*float(r["fiber_g"])
    return e > 0 and min(abs(calc - e), abs(calc2 - e)) / e > 0.08
rule(3, "energy_kcal สอดคล้องกับ 4P+9F+4C หรือ 4P+9F+4C+2Fib (Thai FCD) ภายใน ±8%", [r["menu_id"] for r in menus if energy_bad(r)])
# 4 น้ำตาลไม่มากกว่าคาร์โบไฮเดรต
rule(4, "sugar_g ไม่มากกว่า carb_g", [r["menu_id"] for r in menus if float(r["sugar_g"]) > float(r["carb_g"])])
# 5 ตัวเลขไม่ติดลบ ราคาและปริมาณ > 0
num = ["serving_g", "price_thb", "energy_kcal", "protein_g", "fat_g", "carb_g", "sugar_g", "fiber_g", "sodium_mg"]
def num_bad(r):
    try:
        v = {c: float(r[c]) for c in num}
    except ValueError:
        return True
    return any(x < 0 for x in v.values()) or v["serving_g"] <= 0 or v["price_thb"] <= 0
rule(5, "ค่าโภชนาการ ราคา ปริมาณเป็นตัวเลขไม่ติดลบ และราคา/ปริมาณ > 0", [r["menu_id"] for r in menus if num_bad(r)])
# 6 ค่ามาตรฐาน is_vegetarian และ spicy_level
rule(6, "is_vegetarian เป็น TRUE/FALSE และ spicy_level อยู่ในช่วง 0–3",
     [r["menu_id"] for r in menus if r["is_vegetarian"].upper() not in ("TRUE", "FALSE") or r["spicy_level"] not in ("0", "1", "2", "3")])
# 7 source_id อ้างอิงได้จริง
bad7 = [r["menu_id"] for r in menus if r["source_id"] not in src_ids]
bad7 += [r["article_id"] for r in articles if any(s not in src_ids for s in split(r["source_ids"]))]
bad7 += [r["nutrient_key"] for r in limits if r["source_id"] not in src_ids]
rule(7, "source_id ของเมนู บทความ และเกณฑ์สารอาหารมีอยู่จริงใน sources", bad7)
# 8 article_id ใน nutrient_limits
rule(8, "article_id ใน nutrient_limits ชี้ไปยังบทความที่มีอยู่จริง", [r["nutrient_key"] for r in limits if r["article_id"] not in art_ids])
# 9 ไฟล์ภาพมีอยู่จริง
paths = [p for r in menus for p in (r["image_thumb"], r["image_detail"])] + [r["cover_image"] for r in articles]
rule(9, "ไฟล์ภาพที่ระบุในข้อมูลมีอยู่จริงในโฟลเดอร์", [p for p in paths if not os.path.exists(os.path.join(ROOT, p))])
# 10 รูปแบบ Path สอดคล้องกับรหัส
bad10 = [r["menu_id"] for r in menus if r["image_thumb"] != f"images/menus/{r['menu_id']}_thumb.webp" or r["image_detail"] != f"images/menus/{r['menu_id']}_detail.webp"]
bad10 += [r["article_id"] for r in articles if r["cover_image"] != f"images/articles/{r['article_id']}_cover.webp"]
rule(10, "Path ของภาพเป็นรูปแบบเดียวกันและตรงกับรหัสข้อมูล", bad10)
# 11 รหัสที่ใช้เป็น Key ของ Firebase
keys = list(menu_ids) + list(art_ids) + list(cat_ids) + list(ven_ids) + list(src_ids) + [r["nutrient_key"] for r in limits]
keys += [r["activity_id"] for r in load("activity_levels")] + [r["goal_id"] for r in load("health_goals")]
rule(11, "รหัสที่เป็น Key ไม่มี . $ # [ ] / และเป็นตัวพิมพ์เล็ก", [k for k in keys if re.search(r"[.$#\[\]/]", k) or k != k.lower()])
# 12 บทความมีประเด็นสำคัญ ≥ 3 และอ้างอิง ≥ 1
rule(12, "บทความมี key_points อย่างน้อย 3 ข้อ และ source_ids อย่างน้อย 1 แหล่ง",
     [r["article_id"] for r in articles if len(split(r["key_points"])) < 3 or len(split(r["source_ids"])) < 1])
# 13 อีเมลไม่ซ้ำและใช้โดเมน .test
emails = [r["email"] for r in users]
rule(13, "อีเมลผู้ใช้ทดสอบไม่ซ้ำและใช้โดเมน .test (RFC 2606)",
     [e for e in emails if not e.endswith(".test") or emails.count(e) > 1 or e != e.lower()])
# 14 meal_logs อ้างอิงผู้ใช้และเมนูที่มีอยู่จริง
rule(14, "บันทึกมื้ออาหารทุกแถวอ้างถึง user_id และ menu_id ที่มีอยู่จริง",
     [r["log_id"] for r in logs if r["user_id"] not in user_ids or r["menu_id"] not in menu_ids])

total = 0
for no, desc, errs in rules:
    total += len(errs)
    print(f"{no:>2}. {'ผ่าน' if not errs else 'ไม่ผ่าน'}  ({len(errs)})  {desc}")
    for e in errs[:10]:
        print("      -", e)
passed = sum(1 for r in rules if not r[2])
print(f"\nสรุป: ผ่าน {passed} จาก {len(rules)} กฎ  ข้อผิดพลาดรวม {total} รายการ")
sys.exit(0 if total == 0 else 1)
