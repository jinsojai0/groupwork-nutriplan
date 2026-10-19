// วางแผนมื้ออาหาร (F05) ย้ายมาจากต้นแบบในงานที่ 5
// ตรวจทุกชุดค่าผสมของ 4 ช่วงมื้อ ตัดชุดที่เกินงบ ให้คะแนนตามความใกล้เป้าหมาย แล้วเลือก 3 ชุดที่ดีที่สุดและแตกต่างกัน

export const SODIUM_LIMIT = 2000;

/** ตัวเลือกของแต่ละช่วงมื้อ แต่ละตัวเลือกคือ Array ของรหัสเมนู (บางมื้อมี 2 รายการ เช่น แกง + ข้าวสวย) */
export function mealOptions(menus) {
  const by = (ids) => menus.filter((m) => ids.includes(m.category_id));
  const single = (arr) => arr.map((m) => [m.id]);
  const find = (fn) => menus.find(fn);
  const rice = find((m) => m.name_en?.startsWith("Steamed"));
  const sticky = find((m) => m.name_en === "Sticky Rice");
  const soy = find((m) => m.name_en?.startsWith("Soy Milk"));
  const fruit = find((m) => m.name_en?.startsWith("Mixed Fruit"));

  const isCurryOverRice = (m) => m.category_id === "cat_curry" && /ราดข้าว/.test(m.name_th);
  const mains = by(["cat_rice", "cat_stir", "cat_noodle"]).concat(menus.filter(isCurryOverRice));
  const sides = rice
    ? menus.filter((m) => m.category_id === "cat_curry" && !isCurryOverRice(m)).map((m) => [m.id, rice.id])
    : [];
  const isaan = sticky ? by(["cat_isaan"]).map((m) => [m.id, sticky.id]) : [];
  const food = (arr) => arr.filter((m) => m.energy_kcal > 0); // ไม่นับน้ำเปล่าเป็นมื้ออาหาร

  return {
    breakfast: single(by(["cat_noodle", "cat_rice", "cat_stir"])).concat(soy && fruit ? [[soy.id, fruit.id]] : []),
    lunch: single(mains).concat(sides),
    dinner: single(mains).concat(sides, isaan),
    snack: [[]].concat(single(food(by(["cat_drink", "cat_dessert"])))), // มื้อว่างไม่บังคับ
  };
}

/**
 * @param {object} p
 * @param {Array} p.menus เมนูทั้งหมด
 * @param {number} p.target พลังงานเป้าหมาย (kcal)
 * @param {number} p.budget งบประมาณต่อวัน (บาท)
 * @param {number} p.protein โปรตีนเป้าหมาย (ก.)
 * @returns {{ plans: Array, checked: number, inBudget: number }}
 */
export function generatePlans({ menus, target, budget, protein, vegOnly = false, noSpicy = false, n = 3 }) {
  const M = Object.fromEntries(menus.map((m) => [m.id, m]));
  const opt = mealOptions(menus);
  const allowed = (ids) =>
    ids.every((id) => (!vegOnly || M[id].is_vegetarian) && (!noSpicy || !M[id].spicy_level));
  const sums = (ids) =>
    ids.reduce(
      (a, id) => {
        const m = M[id];
        a.k += m.energy_kcal;
        a.p += m.protein_g;
        a.na += m.sodium_mg;
        a.c += m.price_thb;
        return a;
      },
      { k: 0, p: 0, na: 0, c: 0 },
    );
  const pre = {};
  for (const k of Object.keys(opt)) pre[k] = opt[k].filter(allowed).map((ids) => ({ ids, s: sums(ids) }));

  const candidates = [];
  let checked = 0;
  for (const b of pre.breakfast)
    for (const l of pre.lunch)
      for (const d of pre.dinner)
        for (const s of pre.snack) {
          checked++;
          const c = b.s.c + l.s.c + d.s.c + s.s.c;
          if (c > budget) continue; // ข้อบังคับ : ไม่เกินงบ
          const k = b.s.k + l.s.k + d.s.k + s.s.k;
          const p = b.s.p + l.s.p + d.s.p + s.s.p;
          const na = b.s.na + l.s.na + d.s.na + s.s.na;
          const score =
            Math.abs(k - target) / target +
            (Math.max(0, protein - p) / protein) * 0.5 +
            (Math.max(0, na - SODIUM_LIMIT) / SODIUM_LIMIT) * 2;
          candidates.push({ slots: { breakfast: b.ids, lunch: l.ids, dinner: d.ids, snack: s.ids }, k, p, na, c, score });
        }
  candidates.sort((x, y) => x.score - y.score);

  // ให้แต่ละแผนมีเมนูต่างจากแผนที่เลือกแล้วอย่างน้อย 2 รายการ
  const items = (pl) => Object.values(pl.slots).flat();
  const plans = [];
  for (const cand of candidates) {
    const ci = items(cand);
    if (plans.every((p) => { const pi = items(p); return ci.filter((x) => !pi.includes(x)).length >= 2; }))
      plans.push(cand);
    if (plans.length === n) break;
  }
  return { plans, checked, inBudget: candidates.length };
}
