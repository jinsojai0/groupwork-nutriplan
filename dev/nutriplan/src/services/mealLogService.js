// บันทึกมื้ออาหาร (F04) และข้อมูลรายสัปดาห์ (F08) : meal_logs/{uid}/{YYYY-MM-DD}/{log_id}
import { endAt, orderByKey, push, query, ref, remove, startAt, onValue } from "firebase/database";
import { db, subscribePath, toList } from "./firebase";

export function addMealLog(uid, date, menu, mealType, qty) {
  // เก็บสำเนาค่าโภชนาการ ณ วันที่บันทึก (snapshot) ประวัติจึงไม่เปลี่ยนเมื่อมีการแก้ไขเมนูภายหลัง
  const snapshot = {
    name_th: menu.name_th,
    energy_kcal: menu.energy_kcal,
    protein_g: menu.protein_g,
    fat_g: menu.fat_g,
    carb_g: menu.carb_g,
    sugar_g: menu.sugar_g,
    fiber_g: menu.fiber_g,
    sodium_mg: menu.sodium_mg,
    price_thb: menu.price_thb,
  };
  return push(ref(db, `meal_logs/${uid}/${date}`), {
    menu_id: menu.id,
    meal_type: mealType,
    qty,
    logged_at: new Date().toISOString(),
    snapshot,
  });
}

export function subscribeMealLogs(uid, date, onData, onError) {
  return subscribePath(`meal_logs/${uid}/${date}`, onData, onError, (v) =>
    toList(v).sort((a, b) => (a.logged_at ?? "").localeCompare(b.logged_at ?? "")),
  );
}

export function removeMealLog(uid, date, logId) {
  return remove(ref(db, `meal_logs/${uid}/${date}/${logId}`));
}

/** อ่านบันทึกหลายวันในคำขอเดียว (Key วันที่แบบ ISO เรียงตามเวลาอยู่แล้ว) */
export function subscribeMealLogRange(uid, startDate, endDate, onData, onError) {
  const q = query(ref(db, `meal_logs/${uid}`), orderByKey(), startAt(startDate), endAt(endDate));
  return onValue(
    q,
    (snap) => {
      const days = {};
      for (const [date, logs] of Object.entries(snap.val() ?? {})) days[date] = toList(logs);
      onData(days);
    },
    (error) => onError?.(error),
  );
}
