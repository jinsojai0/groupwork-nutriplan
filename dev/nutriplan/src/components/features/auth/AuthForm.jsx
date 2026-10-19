import { useState } from "react";
import { authErrorMessage, login, register, resetPassword } from "../../../services/authService";
import Button from "../../common/Button";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * ฟอร์มเข้าสู่ระบบ / สมัครสมาชิก / ลืมรหัสผ่าน
 * @param onSuccess เรียกเมื่อเข้าสู่ระบบหรือสมัครสำเร็จ (isNew = true เมื่อสมัครใหม่)
 */
export default function AuthForm({ onSuccess }) {
  const [mode, setMode] = useState("login"); // login | register | reset
  const [form, setForm] = useState({ displayName: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };
  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setMessage(null);
  };

  const validate = () => {
    const e = {};
    if (!EMAIL_RE.test(form.email.trim())) e.email = "กรอกอีเมลให้ถูกรูปแบบ เช่น you@example.com";
    if (mode !== "reset" && !form.password) e.password = "กรอกรหัสผ่าน";
    if (mode === "register") {
      if (!form.displayName.trim()) e.displayName = "กรอกชื่อที่ต้องการแสดง";
      if (form.password.length < 8) e.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
      if (form.confirm !== form.password) e.confirm = "รหัสผ่านทั้งสองช่องไม่ตรงกัน";
    }
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    setMessage(null);
    try {
      if (mode === "reset") {
        await resetPassword(form.email);
        setMessage({ type: "ok", text: `ถ้ามีบัญชีของ ${form.email.trim()} ระบบได้ส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่อีเมลแล้ว (ตรวจในกล่องจดหมายขยะด้วย)` });
      } else if (mode === "register") {
        await register(form);
        onSuccess?.({ isNew: true });
      } else {
        await login(form);
        onSuccess?.({ isNew: false });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: authErrorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  const input = (k, label, props) => (
    <label className="block">
      <span className="label">{label}</span>
      <input className={`input ${errors[k] ? "border-red-400" : ""}`} value={form[k]} onChange={set(k)} aria-invalid={!!errors[k]} {...props} />
      {errors[k] && <p className="field-error">{errors[k]}</p>}
    </label>
  );

  const tab = (m, label) => (
    <button
      type="button"
      role="tab"
      aria-selected={mode === m}
      onClick={() => switchMode(m)}
      className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${mode === m ? "bg-white text-brand-700 shadow-sm" : "text-slate-500"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="card p-5">
      {mode !== "reset" ? (
        <div role="tablist" className="mb-5 flex gap-1 rounded-xl bg-slate-100 p-1">
          {tab("login", "เข้าสู่ระบบ")}
          {tab("register", "สมัครสมาชิก")}
        </div>
      ) : (
        <div className="mb-4">
          <h2 className="font-semibold">ลืมรหัสผ่าน</h2>
          <p className="text-sm text-slate-500">กรอกอีเมลที่ใช้สมัคร ระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้</p>
        </div>
      )}
      <form onSubmit={submit} noValidate className="space-y-3">
        {mode === "register" && input("displayName", "ชื่อที่แสดง", { autoComplete: "nickname" })}
        {input("email", "อีเมล", { type: "email", autoComplete: "email", placeholder: "you@example.com" })}
        {mode !== "reset" &&
          input("password", mode === "register" ? "รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)" : "รหัสผ่าน", {
            type: "password",
            autoComplete: mode === "register" ? "new-password" : "current-password",
          })}
        {mode === "register" && input("confirm", "ยืนยันรหัสผ่าน", { type: "password", autoComplete: "new-password" })}
        {message && (
          <p role={message.type === "error" ? "alert" : "status"} className={`rounded-lg border p-3 text-sm ${message.type === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-800"}`}>
            {message.text}
          </p>
        )}
        <Button type="submit" block disabled={busy}>
          {busy ? "กำลังดำเนินการ…" : mode === "login" ? "เข้าสู่ระบบ" : mode === "register" ? "สมัครสมาชิก" : "ส่งลิงก์ตั้งรหัสผ่านใหม่"}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        {mode === "login" && (
          <button type="button" className="text-brand-700 hover:underline" onClick={() => switchMode("reset")}>
            ลืมรหัสผ่าน?
          </button>
        )}
        {mode === "reset" && (
          <button type="button" className="text-brand-700 hover:underline" onClick={() => switchMode("login")}>
            ‹ กลับไปเข้าสู่ระบบ
          </button>
        )}
      </div>
    </div>
  );
}
