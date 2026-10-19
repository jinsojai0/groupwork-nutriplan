// การคำนวณด้านโภชนาการ (ย้ายมาจากต้นแบบ prototype.html ในงานที่ 5)
// ฟังก์ชันในไฟล์นี้ไม่เรียก React และ Firebase จึงทดสอบแยกได้
import { currentBuddhistYear, fmt } from "./format.js";

export const NUTRIENT_KEYS = ["energy_kcal", "protein_g", "fat_g", "carb_g", "sugar_g", "fiber_g", "sodium_mg"];
export const UNIT_TH = { g: "ก.", mg: "มก.", kcal: "kcal" };
export const MEAL_TYPES = [
  { id: "breakfast", th: "มื้อเช้า" },
  { id: "lunch", th: "มื้อกลางวัน" },
  { id: "dinner", th: "มื้อเย็น" },
  { id: "snack", th: "มื้อว่าง" },
];
export const MEAL_TYPE_TH = Object.fromEntries(MEAL_TYPES.map((m) => [m.id, m.th]));

/** ค่าอ้างอิงเมื่อผู้ใช้ยังไม่ได้ตั้งเป้าหมาย (พลังงาน 2,000 kcal ตามฉลากโภชนาการของไทย) */
export const DEFAULT_TARGETS = { target_kcal: 2000, protein_g: 50, isDefault: true };

/**
 * คำนวณเป้าหมายด้วยสมการ Mifflin-St Jeor
 * BMR = 10W + 6.25H − 5A + 5 (ชาย) หรือ − 161 (หญิง), TDEE = BMR × PAL, เป้าหมาย = TDEE + ส่วนปรับตามเป้าหมาย
 */
export function calcTargets(profile, activityLevels, healthGoals, proteinPerKg = 1) {
  const age = currentBuddhistYear() - Number(profile.birth_year);
  const bmr =
    10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * age + (profile.sex === "male" ? 5 : -161);
  const pal = activityLevels[profile.activity_id]?.pal_factor ?? 1.2;
  const kcalAdjust = healthGoals[profile.goal_id]?.kcal_adjust ?? 0;
  const tdee = bmr * pal;
  return {
    age,
    pal,
    kcal_adjust: kcalAdjust,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    target_kcal: Math.round(tdee + kcalAdjust),
    protein_g: Math.round(profile.weight_kg * proteinPerKg),
  };
}

/** เกณฑ์ของสารอาหารหนึ่งตัว จาก nutrient_limits และเป้าหมายรายบุคคล */
export function limitFor(limit, targets) {
  if (limit.limit_type === "personal") return { type: "target", value: targets.target_kcal };
  if (limit.limit_type === "per_kg") return { type: "min", value: targets.protein_g };
  return { type: limit.limit_type, value: limit.limit_value };
}

/** ร้อยละของเกณฑ์ (ไม่เกิน 999) */
export const percentOf = (value, limitValue) =>
  limitValue > 0 ? Math.min(999, Math.round((value / limitValue) * 100)) : 0;

/** ระดับสถานะสำหรับแถบความคืบหน้า : ok, warn, bad หรือ neutral */
export function levelOf(value, lim) {
  if (lim.type === "max") return value > lim.value ? "bad" : value > lim.value * 0.85 ? "warn" : "ok";
  if (lim.type === "min") return value < lim.value * 0.6 ? "warn" : "ok";
  if (lim.type === "target") return value > lim.value * 1.1 ? "warn" : "ok";
  return "neutral";
}

/**
 * รวมค่าโภชนาการ
 * @param rows [{ values: {energy_kcal, ...}, qty }]
 */
export function sumNutrients(rows) {
  const totals = Object.fromEntries([...NUTRIENT_KEYS, "price_thb"].map((k) => [k, 0]));
  for (const { values, qty = 1 } of rows) {
    if (!values) continue;
    for (const k of Object.keys(totals)) totals[k] += (Number(values[k]) || 0) * qty;
  }
  return totals;
}

/** ผลรวมของบันทึกมื้ออาหาร (ใช้ค่าจาก snapshot ณ เวลาบันทึก) */
export const sumLogs = (logs) => sumNutrients(logs.map((l) => ({ values: l.snapshot, qty: l.qty })));

/** คำเตือนของทั้งวัน พร้อมบทความที่เกี่ยวข้อง (WarningList) */
export function evaluateDay(totals, limits, targets) {
  const out = [];
  for (const l of limits) {
    const lim = limitFor(l, targets);
    const v = totals[l.id] ?? 0;
    const unit = UNIT_TH[l.unit];
    if (lim.type === "max" && v > lim.value)
      out.push({ key: l.id, level: "bad", text: `${l.name_th}เกินเกณฑ์ ${fmt(v - lim.value)} ${unit} (ได้ ${fmt(v)} จาก ${fmt(lim.value)} ${unit})`, articleId: l.article_id });
    else if (lim.type === "max" && v > lim.value * 0.85)
      out.push({ key: l.id, level: "warn", text: `${l.name_th}ใกล้เกินเกณฑ์ ได้ ${fmt(v)} จาก ${fmt(lim.value)} ${unit}`, articleId: l.article_id });
    else if (lim.type === "min" && v < lim.value * 0.6)
      out.push({ key: l.id, level: "warn", text: `${l.name_th}ยังน้อย ได้ ${fmt(v)} จาก ${fmt(lim.value)} ${unit}`, articleId: l.article_id });
    else if (lim.type === "target" && v > lim.value * 1.1)
      out.push({ key: l.id, level: "warn", text: `พลังงานเกินเป้าหมาย ${fmt(v - lim.value)} kcal`, articleId: l.article_id });
  }
  return out;
}

/** คำเตือนของเมนูเดียว : สารอาหารที่ต้องจำกัดซึ่งเมนูนี้ให้มากกว่าครึ่งหนึ่งของเกณฑ์ทั้งวัน */
export function evaluateMenu(menu, limits) {
  const out = [];
  for (const l of limits) {
    if (l.limit_type !== "max") continue;
    const share = menu[l.id] / l.limit_value;
    if (share < 0.5) continue;
    let text = `เมนูนี้ให้${l.name_th} ${percentOf(menu[l.id], l.limit_value)}% ของเกณฑ์ทั้งวัน (${fmt(l.limit_value)} ${UNIT_TH[l.unit]})`;
    if (l.id === "sugar_g") text += ` หรือประมาณ ${Math.round(menu.sugar_g / 4)} ช้อนชา`;
    out.push({ key: l.id, level: share >= 0.7 ? "bad" : "warn", text, articleId: l.article_id });
  }
  return out;
}

/** ป้ายสรุปของการ์ดเมนู */
export function nutrientBadge(menu) {
  if (menu.sodium_mg >= 1500) return { level: "bad", text: "โซเดียมสูง" };
  if (menu.energy_kcal <= 400 && menu.sodium_mg < 1000) return { level: "ok", text: "เบา" };
  return null;
}

/** ตรวจความสอดคล้องของพลังงานกับสารอาหารหลัก 4P + 9F + 4C (ยอมรับต่างกันไม่เกิน ±8%) */
export function checkEnergy({ protein_g, fat_g, carb_g, energy_kcal }) {
  const calc = 4 * Number(protein_g) + 9 * Number(fat_g) + 4 * Number(carb_g);
  const energy = Number(energy_kcal);
  if (!calc || !energy) return { calc, diffPct: null, ok: energy === 0 && calc === 0 };
  const diffPct = ((energy - calc) / calc) * 100;
  return { calc, diffPct, ok: Math.abs(diffPct) <= 8 };
}

/** เมนูแนะนำบนหน้าแรก : พลังงาน ≤ 450 kcal โซเดียม ≤ 1,200 มก. ไขมัน ≤ 20 ก. น้ำตาล ≤ 15 ก. */
export function featuredMenus(menus, n = 4) {
  return menus
    .filter(
      (m) =>
        m.energy_kcal <= 450 && m.sodium_mg <= 1200 && m.fat_g <= 20 && m.sugar_g <= 15 &&
        !["cat_drink", "cat_side", "cat_dessert"].includes(m.category_id),
    )
    .sort((a, b) => a.sodium_mg - b.sodium_mg)
    .slice(0, n);
}

/** ค้นหาจากชื่อไทย ชื่ออังกฤษ และ tags */
export function searchMenus(menus, q) {
  const k = q.trim().toLowerCase();
  if (!k) return [];
  return menus.filter((m) =>
    [m.name_th, m.name_en, ...(m.tags ?? [])].join(" ").toLowerCase().includes(k),
  );
}
