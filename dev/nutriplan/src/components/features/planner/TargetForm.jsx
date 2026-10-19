import { useState } from "react";
import { validateProfile } from "../../../utils/validation";
import Button from "../../common/Button";

const EMPTY = {
  sex: "",
  birth_year: "",
  weight_kg: "",
  height_cm: "",
  activity_id: "",
  goal_id: "",
  budget_per_day_thb: "",
};


/** ฟอร์มข้อมูลร่างกายพร้อมช่องยินยอมก่อนบันทึกข้อมูลสุขภาพ */
export default function TargetForm({ profile, consentAt, activityLevels, healthGoals, onSave }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(profile ?? {}) }));
  const [consent, setConsent] = useState(Boolean(consentAt));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
    setMessage(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = validateProfile(form);
    if (!consent) er.consent = "กรุณายืนยันความยินยอมก่อนบันทึกข้อมูลสุขภาพ";
    setErrors(er);
    if (Object.keys(er).length) {
      setMessage({ type: "error", text: "กรุณาตรวจสอบข้อมูลที่ไม่ถูกต้อง" });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await onSave({
        sex: form.sex,
        birth_year: Number(form.birth_year),
        weight_kg: Number(form.weight_kg),
        height_cm: Number(form.height_cm),
        activity_id: form.activity_id,
        goal_id: form.goal_id,
        budget_per_day_thb: Number(form.budget_per_day_thb),
      });
      setMessage({ type: "ok", text: "บันทึกและคำนวณเป้าหมายแล้ว" });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err?.code === "PERMISSION_DENIED" ? "ข้อมูลไม่ผ่านการตรวจสอบของระบบ" : "บันทึกไม่สำเร็จ กรุณาลองใหม่",
      });
    } finally {
      setSaving(false);
    }
  };

  const err = (k) => errors[k] && <p className="field-error">{errors[k]}</p>;
  const inv = (k) => (errors[k] ? "border-red-400" : "");

  return (
    <form onSubmit={submit} noValidate className="card space-y-4 p-4 md:p-5">
      <div className="grid grid-cols-2 gap-3">
        <label>
          <span className="label">เพศ (ใช้ในสมการ)</span>
          <select className={`input ${inv("sex")}`} value={form.sex} onChange={set("sex")}>
            <option value="">เลือก</option>
            <option value="female">หญิง</option>
            <option value="male">ชาย</option>
          </select>
          {err("sex")}
        </label>
        <label>
          <span className="label">ปีเกิด (พ.ศ.)</span>
          <input className={`input ${inv("birth_year")}`} inputMode="numeric" value={form.birth_year} onChange={set("birth_year")} placeholder="2548" />
          {err("birth_year")}
        </label>
        <label>
          <span className="label">น้ำหนัก (กก.)</span>
          <input className={`input ${inv("weight_kg")}`} type="number" step="0.1" inputMode="decimal" value={form.weight_kg} onChange={set("weight_kg")} placeholder="54" />
          {err("weight_kg")}
        </label>
        <label>
          <span className="label">ส่วนสูง (ซม.)</span>
          <input className={`input ${inv("height_cm")}`} type="number" step="0.1" inputMode="decimal" value={form.height_cm} onChange={set("height_cm")} placeholder="160" />
          {err("height_cm")}
        </label>
      </div>
      <label className="block">
        <span className="label">ระดับกิจกรรม</span>
        <select className={`input ${inv("activity_id")}`} value={form.activity_id} onChange={set("activity_id")}>
          <option value="">เลือก</option>
          {activityLevels.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name_th}
            </option>
          ))}
        </select>
        {form.activity_id && (
          <span className="mt-1 block text-xs text-slate-500">
            ตัวอย่าง : {activityLevels.find((a) => a.id === form.activity_id)?.example}
          </span>
        )}
        {err("activity_id")}
      </label>
      <fieldset>
        <legend className="label">เป้าหมาย</legend>
        <div className="flex flex-wrap gap-2">
          {healthGoals.map((g) => (
            <label key={g.id} className={`chip cursor-pointer ${form.goal_id === g.id ? "chip-on" : ""}`} title={g.description}>
              <input type="radio" name="goal_id" value={g.id} checked={form.goal_id === g.id} onChange={set("goal_id")} className="sr-only" />
              {g.name_th}
            </label>
          ))}
        </div>
        {err("goal_id")}
      </fieldset>
      <label className="block">
        <span className="label">งบประมาณค่าอาหารต่อวัน (บาท)</span>
        <input className={`input ${inv("budget_per_day_thb")}`} type="number" inputMode="numeric" value={form.budget_per_day_thb} onChange={set("budget_per_day_thb")} placeholder="150" />
        {err("budget_per_day_thb")}
      </label>

      <div className={`rounded-lg border p-3 ${errors.consent ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50"}`}>
        <label className="flex cursor-pointer items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-brand-700"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              setErrors((er) => ({ ...er, consent: undefined }));
            }}
          />
          <span>
            ข้าพเจ้ายินยอมให้ NutriPlan เก็บข้อมูลเพศ ปีเกิด น้ำหนัก และส่วนสูง เพื่อใช้คำนวณเป้าหมายพลังงานเท่านั้น
            ข้อมูลนี้เห็นได้เฉพาะเจ้าของบัญชี และลบได้ทุกเมื่อด้วยปุ่ม “ลบข้อมูลของฉัน”
          </span>
        </label>
        {err("consent")}
      </div>

      {message && (
        <p role={message.type === "error" ? "alert" : "status"} className={`text-sm ${message.type === "error" ? "text-red-700" : "text-green-700"}`}>
          {message.text}
        </p>
      )}
      <Button type="submit" block disabled={saving}>
        {saving ? "กำลังบันทึก…" : "บันทึกและคำนวณเป้าหมาย"}
      </Button>
    </form>
  );
}
