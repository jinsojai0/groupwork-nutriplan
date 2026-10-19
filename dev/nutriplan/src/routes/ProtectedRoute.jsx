import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StateView from "../components/common/StateView";

/** กันหน้าที่ต้องเข้าสู่ระบบ : ถ้ายังไม่เข้าสู่ระบบจะพาไปหน้า /login แล้วกลับมาหน้าเดิมหลังเข้าสู่ระบบ */
export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <StateView kind="loading" variant="block" message="กำลังตรวจสอบการเข้าสู่ระบบ…" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search, reason: "protected" }} />;
  return <Outlet />;
}
