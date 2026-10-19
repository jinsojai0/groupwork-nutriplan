import { useMemo } from "react";
import { subscribeNutrientLimits } from "../services/menuService";
import { useRealtime } from "./useRealtime";

/** เกณฑ์สารอาหาร 7 รายการ เรียงตาม sort_order */
export function useNutrientLimits() {
  const res = useRealtime("nutrient_limits", subscribeNutrientLimits);
  const limits = useMemo(() => res.data ?? [], [res.data]);
  const byKey = useMemo(() => Object.fromEntries(limits.map((l) => [l.id, l])), [limits]);
  return { ...res, limits, byKey };
}
