import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import StateView from "../components/common/StateView";
import AuthForm from "../components/features/auth/AuthForm";
import { useAuth } from "../context/AuthContext";
import { usePageTitle } from "../hooks/usePageTitle";

/** P05 เข้าสู่ระบบ / สมัครสมาชิก / ลืมรหัสผ่าน */
export default function LoginPage() {
  usePageTitle("เข้าสู่ระบบ");
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from && location.state.from !== "/login" ? location.state.from : null;
  // ตรวจครั้งเดียวว่าเปิดหน้านี้ขณะเข้าสู่ระบบอยู่แล้วหรือไม่
  const [alreadyIn, setAlreadyIn] = useState(null);
  if (!loading && alreadyIn === null) setAlreadyIn(!!user);

  if (alreadyIn === null) return <StateView kind="loading" variant="block" />;

  if (alreadyIn && user) {
    return (
      <div className="mx-auto max-w-md py-6 text-center">
        <h1 className="text-2xl font-bold">คุณเข้าสู่ระบบแล้ว</h1>
        <p className="mt-1 text-slate-500">{user.email}</p>
        <div className="mt-5 flex justify-center gap-2">
          <Button to="/today">ไปที่บันทึกวันนี้</Button>
          <Button to="/profile" variant="ghost">โปรไฟล์ของฉัน</Button>
        </div>
      </div>
    );
  }

  const onSuccess = ({ isNew }) => navigate(isNew ? "/profile" : from ?? "/today", { replace: true });

  return (
    <div className="mx-auto max-w-md py-2">
      <h1 className="mb-1 text-2xl font-bold">ยินดีต้อนรับสู่ NutriPlan</h1>
      <p className="mb-5 text-slate-500">
        {location.state?.reason === "protected"
          ? "หน้านี้สำหรับสมาชิก กรุณาเข้าสู่ระบบหรือสมัครสมาชิกก่อน"
          : "เข้าสู่ระบบเพื่อบันทึกมื้ออาหาร ตั้งเป้าหมาย และวางแผนมื้ออาหาร"}
      </p>
      <AuthForm onSuccess={onSuccess} />
      <p className="mt-4 text-center text-sm text-slate-500">
        <Link to="/" className="hover:underline">ใช้งานต่อโดยไม่เข้าสู่ระบบ</Link>
      </p>
    </div>
  );
}
