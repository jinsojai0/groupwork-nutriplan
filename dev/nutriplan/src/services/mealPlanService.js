// แผนมื้ออาหารที่ผู้ใช้บันทึก (F05) : meal_plans/{uid}/{date}
import { ref, remove, set } from "firebase/database";
import { db, subscribePath } from "./firebase";

export function saveMealPlan(uid, date, plan) {
  // Firebase ไม่บันทึก Array ว่าง จึงเก็บเฉพาะช่วงมื้อที่มีเมนู
  const slots = Object.fromEntries(Object.entries(plan.slots).filter(([, ids]) => ids.length));
  return set(ref(db, `meal_plans/${uid}/${date}`), {
    slots,
    total_kcal: Math.round(plan.k),
    total_protein_g: Math.round(plan.p * 10) / 10,
    total_sodium_mg: Math.round(plan.na),
    total_price: plan.c,
    saved_at: new Date().toISOString(),
  });
}

export function subscribeMealPlan(uid, date, onData, onError) {
  return subscribePath(`meal_plans/${uid}/${date}`, onData, onError);
}

export function removeMealPlan(uid, date) {
  return remove(ref(db, `meal_plans/${uid}/${date}`));
}
