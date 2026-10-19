import { useMemo } from "react";
import { subscribeMenus } from "../services/menuService";
import { useRealtime } from "./useRealtime";

/** เมนูทั้งหมด พร้อม byId สำหรับค้นหาตามรหัส */
export function useMenus() {
  const res = useRealtime("menus", subscribeMenus);
  const menus = useMemo(() => res.data ?? [], [res.data]);
  const byId = useMemo(() => Object.fromEntries(menus.map((m) => [m.id, m])), [menus]);
  return { ...res, menus, byId };
}
