import { subscribeMealPlan } from "../services/mealPlanService";
import { useRealtime } from "./useRealtime";

/** แผนมื้ออาหารที่บันทึกไว้ของวันหนึ่ง */
export function useMealPlan(uid, date) {
  const res = useRealtime(uid && date ? `meal_plans/${uid}/${date}` : null, (ok, err) =>
    subscribeMealPlan(uid, date, ok, err),
  );
  return { ...res, plan: res.data ?? null };
}
