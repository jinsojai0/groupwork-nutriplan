import { useMemo } from "react";
import { subscribeLookup } from "../services/menuService";
import { useRealtime } from "./useRealtime";

/**
 * ข้อมูลอ้างอิงขนาดเล็ก : activity_levels, health_goals, sources, vendor_types, meta
 * คืนค่า map (Object ตามรหัส) และ list (เรียงตาม sort_order ถ้ามี)
 */
export function useLookup(node) {
  const res = useRealtime(node, (ok, err) => subscribeLookup(node, ok, err));
  const map = useMemo(() => res.data ?? {}, [res.data]);
  const list = useMemo(
    () =>
      Object.entries(map)
        .map(([id, v]) => (typeof v === "object" ? { id, ...v } : { id, value: v }))
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [map],
  );
  return { ...res, map, list };
}
