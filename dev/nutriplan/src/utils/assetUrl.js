// แปลง Path สัมพัทธ์ในข้อมูล (เช่น images/menus/menu_007_thumb.webp) เป็น URL เต็ม
const BASE = import.meta.env.VITE_ASSET_BASE_URL || "/";

export const assetUrl = (path) =>
  path ? new URL(path, new URL(BASE, window.location.origin)).href : "";
