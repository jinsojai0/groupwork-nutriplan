// เมนูโปรด (F07) : favorites/{uid}/{menu_id} = true
import { ref, set } from "firebase/database";
import { db, subscribePath } from "./firebase";

export function subscribeFavorites(uid, onData, onError) {
  return subscribePath(`favorites/${uid}`, onData, onError, (v) => Object.keys(v ?? {}));
}

/** เพิ่มด้วยค่า true และลบด้วยค่า null จึงไม่เกิดรายการซ้ำ */
export function setFavorite(uid, menuId, isFavorite) {
  return set(ref(db, `favorites/${uid}/${menuId}`), isFavorite ? true : null);
}
