# -*- coding: utf-8 -*-
"""ตรวจสอบคุณภาพไฟล์ JSON ก่อนนำเข้า Firebase Realtime Database (ตามหัวข้อ 2.6 ของงานที่ 5)

วิธีใช้ :  python firebase/check_firebase_json.py   (รันจากโฟลเดอร์ใดก็ได้)
"""
import json, re, sys, os
from collections import defaultdict

PATH = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "nutriplan-firebase.json")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(PATH)))  # โฟลเดอร์โครงงาน GroupWork_NutriPlan (images/, icons/ อยู่ที่ระดับบนสุด เทียบเท่า public/ ของ React)
FORBIDDEN = re.compile(r"[.$#\[\]/]")
results = []

def check(no, name, bad, how):
    results.append({"no": no, "check": name, "how": how, "errors": len(bad),
                    "result": "ผ่าน" if not bad else "ไม่ผ่าน", "examples": bad[:5]})

# 1) โครงสร้าง JSON ถูกต้อง (comma เกิน/ตกหล่น จะทำให้ parse ไม่ผ่าน)
raw = open(PATH, encoding="utf-8").read()
try:
    db = json.loads(raw)
    check(1, "ไฟล์มีโครงสร้าง JSON ที่ถูกต้อง (ไม่มี comma เกินหรือตกหล่น)", [], "json.loads() อ่านไฟล์ทั้งไฟล์")
except json.JSONDecodeError as e:
    check(1, "ไฟล์มีโครงสร้าง JSON ที่ถูกต้อง (ไม่มี comma เกินหรือตกหล่น)",
          ["บรรทัด %d คอลัมน์ %d: %s" % (e.lineno, e.colno, e.msg)], "json.loads()")
    print(json.dumps(results, ensure_ascii=False, indent=2)); sys.exit(1)

# เดินทุก Key / ค่า
keys_bad, nulls, empties, depth_max, long_keys = [], [], [], [0], []
def walk(node, path, depth):
    depth_max[0] = max(depth_max[0], depth)
    if node is None:
        nulls.append(path)
    elif isinstance(node, dict):
        if not node:
            empties.append(path)
        for k, v in node.items():
            if FORBIDDEN.search(k) or not k:
                keys_bad.append(path + "/" + k)
            if len(k.encode("utf-8")) > 768:
                long_keys.append(path + "/" + k)
            walk(v, path + "/" + k, depth + 1)
    elif isinstance(node, list):
        if not node:
            empties.append(path)
        for i, v in enumerate(node):
            walk(v, "%s[%d]" % (path, i), depth + 1)
walk(db, "", 0)

check(2, "Key ไม่มีอักขระต้องห้าม . $ # [ ] / และไม่เป็นค่าว่าง", keys_bad, "Regex [.$#\\[\\]/] กับทุก Key")
check(3, "ไม่มีค่า null และไม่มี Object หรือ Array ว่าง (Firebase จะไม่บันทึกค่าเหล่านี้)", nulls + empties,
      "เดินทุกโหนดแบบ recursive")
check(4, "ความลึกของโครงสร้างไม่เกิน 32 ระดับ และความยาว Key ไม่เกิน 768 ไบต์",
      (["ลึก %d ระดับ" % depth_max[0]] if depth_max[0] > 32 else []) + long_keys,
      "วัดความลึกสูงสุด = %d ระดับ" % depth_max[0])

# 5) Field ของข้อมูลประเภทเดียวกันใช้ชื่อเหมือนกัน  6) ชนิดข้อมูลสม่ำเสมอ
field_bad, type_bad = [], []
TYPE = lambda v: "Boolean" if isinstance(v, bool) else "Number" if isinstance(v, (int, float)) else \
                 "String" if isinstance(v, str) else "Array" if isinstance(v, list) else "Object"
for node, recs in db.items():
    if node == "meta" or not isinstance(recs, dict):
        continue
    ref = None
    types = defaultdict(set)
    for rid, rec in recs.items():
        ks = tuple(sorted(rec.keys()))
        if ref is None:
            ref = ks
        elif ks != ref:
            field_bad.append("%s/%s มี Field ต่างจากรายการแรก" % (node, rid))
        for k, v in rec.items():
            types[(node, k)].add(TYPE(v))
    for (n, k), ts in types.items():
        if len(ts) > 1:
            type_bad.append("%s.%s มีหลายชนิด %s" % (n, k, sorted(ts)))
check(5, "ข้อมูลประเภทเดียวกันใช้ชื่อ Field ชุดเดียวกันทุกรายการ", field_bad, "เทียบชุด Key ของทุกรายการกับรายการแรก")
check(6, "ชนิดข้อมูลของแต่ละ Field สม่ำเสมอ (Number, String, Boolean, Array)", type_bad,
      "เก็บชนิดข้อมูลของทุกค่าแยกตาม Field")

# 7) รหัสข้อมูลไม่ซ้ำ (ใน JSON Key ซ้ำจะถูกเขียนทับ จึงตรวจจากข้อความดิบ)
dup = []
for node in ("categories", "menus", "articles", "sources", "vendor_types"):
    ids = re.findall(r'^\s{4}"(%s[^"]*)"\s*:\s*\{' % {"categories": "cat_", "menus": "menu_", "articles": "article_",
                                                     "sources": "src_", "vendor_types": "shop_"}[node], raw, re.M)
    dup += ["%s ซ้ำ %s" % (node, i) for i in set(ids) if ids.count(i) > 1]
check(7, "รหัสข้อมูลไม่ซ้ำกัน", dup, "นับรหัสจากข้อความดิบของไฟล์ (Key ซ้ำใน JSON จะถูกเขียนทับโดยไม่แจ้งเตือน)")

# 8) รหัสอ้างอิงเชื่อมโยงไปยังข้อมูลที่มีอยู่จริง
ref_bad = []
for mid, m in db["menus"].items():
    if m["category_id"] not in db["categories"]: ref_bad.append(mid + " → " + m["category_id"])
    if m["vendor_type_id"] not in db["vendor_types"]: ref_bad.append(mid + " → " + m["vendor_type_id"])
    if m["source_id"] not in db["sources"]: ref_bad.append(mid + " → " + m["source_id"])
for aid, a in db["articles"].items():
    ref_bad += [aid + " → " + s for s in a["source_ids"] if s not in db["sources"]]
    if a["related_nutrient"] != "general" and a["related_nutrient"] not in db["nutrient_limits"]:
        ref_bad.append(aid + " → " + a["related_nutrient"])
for nk, l in db["nutrient_limits"].items():
    if l["article_id"] not in db["articles"]: ref_bad.append(nk + " → " + l["article_id"])
    if l["source_id"] not in db["sources"]: ref_bad.append(nk + " → " + l["source_id"])
check(8, "รหัสอ้างอิงทุกตัวชี้ไปยังข้อมูลที่มีอยู่จริง", ref_bad,
      "ตรวจ category_id, vendor_type_id, source_id, source_ids, article_id, related_nutrient")

# 9) Path รูปภาพรูปแบบเดียวกันและมีไฟล์จริง
img_bad = []
for mid, m in db["menus"].items():
    for f, suf in (("image_thumb", "thumb"), ("image_detail", "detail")):
        exp = "images/menus/%s_%s.webp" % (mid, suf)
        if m[f] != exp: img_bad.append("%s.%s ไม่ตรงรูปแบบ" % (mid, f))
        elif not os.path.exists(os.path.join(ROOT, m[f])): img_bad.append("ไม่พบไฟล์ " + m[f])
for aid, a in db["articles"].items():
    if a["cover_image"] != "images/articles/%s_cover.webp" % aid: img_bad.append(aid + " ปกไม่ตรงรูปแบบ")
    elif not os.path.exists(os.path.join(ROOT, a["cover_image"])): img_bad.append("ไม่พบไฟล์ " + a["cover_image"])
for cid, c in db["categories"].items():
    if not os.path.exists(os.path.join(ROOT, c["icon"])): img_bad.append("ไม่พบไฟล์ " + c["icon"])
local_paths = re.findall(r'"[A-Za-z]:\\\\[^"]*"|"/Users/[^"]*"|"/home/[^"]*"', raw)
check(9, "Path รูปภาพเป็นรูปแบบเดียวกัน ตรงกับรหัสข้อมูล มีไฟล์จริง และไม่อ้างอิงตำแหน่งในเครื่องส่วนตัว",
      img_bad + local_paths, "เทียบ Path กับรูปแบบที่กำหนด ตรวจไฟล์ด้วย os.path.exists และค้นหา C:\\ หรือ /Users/")

# 10) ไม่มีข้อมูลทดลอง
junk = re.findall(r"(?i)lorem ipsum|\btest\b|\bxxx\b|ทดสอบ|ทดลอง|asdf", raw)
check(10, "ไม่มีข้อมูลทดลองหรือข้อความที่ไม่เกี่ยวข้อง (เช่น Lorem ipsum, test, ทดสอบ)", junk,
      "ค้นหาคำต้องห้ามด้วย Regex ทั้งไฟล์")

# 11) ปริมาณข้อมูลขั้นต่ำ
qty = []
if len(db["categories"]) < 3: qty.append("หมวดหมู่ %d < 3" % len(db["categories"]))
if len(db["menus"]) < 15: qty.append("ข้อมูลหลัก %d < 15" % len(db["menus"]))
check(11, "ปริมาณข้อมูลขั้นต่ำ หมวดหมู่ ≥ 3 และข้อมูลหลัก ≥ 15 รายการ", qty,
      "หมวดหมู่ %d หมวด, เมนู %d รายการ, บทความ %d เรื่อง" % (len(db["categories"]), len(db["menus"]), len(db["articles"])))

print("=" * 76)
for r in results:
    print("%2d. %-64s %s (%d)" % (r["no"], r["check"][:64], r["result"], r["errors"]))
    for e in r["examples"]:
        print("      -", e)
print("=" * 76)
ok = sum(1 for r in results if r["result"] == "ผ่าน")
print("ผ่าน %d จาก %d รายการ | ขนาดไฟล์ %.1f KB | Node หลัก %d Node" %
      (ok, len(results), len(raw.encode("utf-8"))/1024, len(db)))
json.dump(results, open(os.path.join(os.path.dirname(os.path.abspath(PATH)), "json-check-result.json"), "w",
                        encoding="utf-8"), ensure_ascii=False, indent=2)
sys.exit(0 if ok == len(results) else 1)
