// ตรวจข้อมูลในฟอร์มก่อนบันทึก (ช่วงค่าเดียวกับ Security Rules ใน database.rules.json)
import { currentBuddhistYear } from "./format.js";

/** ฟอร์มโปรไฟล์ (P06) */
export function validateProfile(f) {
  const e = {};
  const year = currentBuddhistYear();
  if (!["male", "female"].includes(f.sex)) e.sex = "เลือกเพศที่ใช้ในการคำนวณ";
  const by = Number(f.birth_year);
  if (!Number.isInteger(by) || by < year - 100 || by > year - 10)
    e.birth_year = `กรอกปีเกิดแบบ พ.ศ. ระหว่าง ${year - 100} ถึง ${year - 10}`;
  const w = Number(f.weight_kg);
  if (f.weight_kg === "" || !(w >= 20 && w <= 300)) e.weight_kg = "น้ำหนักต้องอยู่ระหว่าง 20–300 กก.";
  const h = Number(f.height_cm);
  if (f.height_cm === "" || !(h >= 100 && h <= 250)) e.height_cm = "ส่วนสูงต้องอยู่ระหว่าง 100–250 ซม.";
  if (!f.activity_id) e.activity_id = "เลือกระดับกิจกรรม";
  if (!f.goal_id) e.goal_id = "เลือกเป้าหมาย";
  const b = Number(f.budget_per_day_thb);
  if (f.budget_per_day_thb === "" || !(b >= 30 && b <= 2000)) e.budget_per_day_thb = "งบประมาณต้องอยู่ระหว่าง 30–2,000 บาท";
  return e;
}

/** ฟอร์มเมนู (P14) */
export function validateMenu(f) {
  const e = {};
  if (!f.name_th.trim()) e.name_th = "กรอกชื่อภาษาไทย";
  if (!f.name_en.trim()) e.name_en = "กรอกชื่อภาษาอังกฤษ";
  if (!f.category_id) e.category_id = "เลือกหมวดอาหาร";
  if (!f.vendor_type_id) e.vendor_type_id = "เลือกประเภทร้าน";
  if (!f.serving_desc.trim()) e.serving_desc = "กรอกหน่วยบริโภค";
  if (!f.source_id) e.source_id = "เลือกแหล่งข้อมูล";
  const num = (k, min, max, msg) => {
    const v = Number(f[k]);
    if (f[k] === "" || Number.isNaN(v) || v < min || v > max) e[k] = msg;
  };
  num("serving_g", 1, 3000, "น้ำหนัก 1–3,000 กรัม");
  num("price_thb", 1, 2000, "ราคา 1–2,000 บาท");
  num("energy_kcal", 0, 3000, "พลังงาน 0–3,000 kcal");
  for (const k of ["protein_g", "fat_g", "carb_g", "sugar_g", "fiber_g"]) num(k, 0, 500, "0–500 กรัม");
  num("sodium_mg", 0, 20000, "โซเดียม 0–20,000 มก.");
  return e;
}
