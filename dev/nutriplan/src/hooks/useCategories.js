import { useMemo } from "react";
import { subscribeCategories } from "../services/menuService";
import { useRealtime } from "./useRealtime";

export function useCategories() {
  const res = useRealtime("categories", subscribeCategories);
  const categories = useMemo(() => res.data ?? [], [res.data]);
  const byId = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);
  return { ...res, categories, byId };
}
