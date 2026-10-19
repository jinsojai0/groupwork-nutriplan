import { useEffect } from "react";

/** ตั้งชื่อแท็บของเบราว์เซอร์ตามหน้าที่เปิด */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · NutriPlan` : "NutriPlan · วางแผนมื้ออาหารจานเดียว";
  }, [title]);
}
