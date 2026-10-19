import { subscribeMenu } from "../services/menuService";
import { useRealtime } from "./useRealtime";

/** เมนูหนึ่งรายการ (data เป็น null เมื่อไม่พบรหัส) */
export function useMenu(menuId) {
  const res = useRealtime(menuId ? `menus/${menuId}` : null, (ok, err) => subscribeMenu(menuId, ok, err));
  return { ...res, menu: res.data };
}
