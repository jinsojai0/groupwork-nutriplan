// ข้อมูลเมนูและข้อมูลอ้างอิง (F02, F09)
import { increment, ref, update } from "firebase/database";
import { db, subscribePath, toList } from "./firebase";

const byId = (a, b) => a.id.localeCompare(b.id);
const bySortOrder = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0);

export function subscribeMenus(onData, onError) {
  return subscribePath("menus", onData, onError, (v) => toList(v).sort(byId));
}

export function subscribeMenu(menuId, onData, onError) {
  return subscribePath(`menus/${menuId}`, onData, onError, (v) => (v ? { id: menuId, ...v } : null));
}

export function subscribeCategories(onData, onError) {
  return subscribePath("categories", onData, onError, (v) => toList(v).sort(bySortOrder));
}

export function subscribeNutrientLimits(onData, onError) {
  return subscribePath("nutrient_limits", onData, onError, (v) => toList(v).sort(bySortOrder));
}

/** ข้อมูลอ้างอิงขนาดเล็ก : activity_levels, health_goals, sources, vendor_types, meta */
export function subscribeLookup(node, onData, onError) {
  return subscribePath(node, onData, onError);
}

/** รหัสเมนูถัดไป เช่น menu_050 */
export function nextMenuId(menus) {
  const max = menus.reduce((m, x) => Math.max(m, Number(x.id.replace("menu_", "")) || 0), 0);
  return `menu_${String(max + 1).padStart(3, "0")}`;
}

/**
 * บันทึกเมนูพร้อมปรับ categories/{id}/menu_count ในคำสั่งเดียว (multi-path update)
 * @param previousCategoryId หมวดเดิมเมื่อแก้ไข (null เมื่อเพิ่มเมนูใหม่)
 */
export function saveMenu(menuId, data, previousCategoryId) {
  const updates = { [`menus/${menuId}`]: data };
  if (!previousCategoryId) {
    updates[`categories/${data.category_id}/menu_count`] = increment(1);
  } else if (previousCategoryId !== data.category_id) {
    updates[`categories/${previousCategoryId}/menu_count`] = increment(-1);
    updates[`categories/${data.category_id}/menu_count`] = increment(1);
  }
  return update(ref(db), updates);
}
