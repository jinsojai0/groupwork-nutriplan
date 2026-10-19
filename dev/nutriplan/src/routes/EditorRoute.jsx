import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StateView from "../components/common/StateView";
import NotFoundPage from "../pages/NotFoundPage";

/** กันหน้าสำหรับผู้ดูแลข้อมูล (roles/{uid} เป็น editor หรือ admin) */
export default function EditorRoute() {
  const { user, loading, isEditor } = useAuth();
  const location = useLocation();
  if (loading) return <StateView kind="loading" variant="block" message="กำลังตรวจสอบสิทธิ์…" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname, reason: "protected" }} />;
  if (!isEditor) return <NotFoundPage />;
  return <Outlet />;
}
