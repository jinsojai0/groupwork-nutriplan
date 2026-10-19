import { Fragment, useState } from "react";
import { fmt, todayKey } from "../../../utils/format";
import { checkEnergy, NUTRIENT_KEYS, UNIT_TH } from "../../../utils/nutrition";
import { validateMenu } from "../../../utils/validation";
import Button from "../../common/Button";

const NUTRIENT_TH = { energy_kcal: "พลังงาน", protein_g: "โปรตีน", fat_g: "ไขมัน", carb_g: "คาร์โบไฮเดรต", sugar_g: "น้ำตาล", fiber_g: "ใยอาหาร", sodium_mg: "โซเดียม" };
const NUMBER_FIELDS = ["serving_g", "price_thb", "spicy_level", ...NUTRIENT_KEYS];

function toForm(menu) {
  const f = {
    name_th: "", name_en: "", category_id: "", vendor_type_id: "", serving_desc: "1 จาน",
    serving_g: "", price_thb: "", spicy_level: "0", is_vegetarian: false, tags: "",
    source_id: "", verification_status: "PENDING",
    ...Object.fromEntries(NUTRIENT_KEYS.map((k) => [k, ""])),
  };
  if (!menu) return f;
  for (const k of Object.keys(f)) if (menu[k] !== undefined) f[k] = menu[k];
  for (const k of NUMBER_FIELDS) f[k] = String(menu[k] ?? "");
  f.tags = (menu.tags ?? []).join(", ");
  return f;
}


/** ฟอร์มเพิ่ม/แก้ไขเมนู พร้อมตรวจ 4P + 9F + 4C */
export default function MenuForm({ menuId, menu, categories, vendorTypes, sources, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => toForm(menu));
  const [errors, setErrors] = useState({});
  const [ackEnergy, setAckEnergy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };
  const energy = checkEnergy(form);

  const submit = async (e) => {
    e.preventDefault();
    const er = validateMenu(form);
    if (!energy.ok && !ackEnergy) er.energy = "พลังงานต่างจากค่าที่คำนวณเกิน 8% ตรวจค่าอีกครั้ง หรือติ๊กยืนยันว่าค่าถูกต้อง";
    setErrors(er);
    if (Object.keys(er).length) {
      setMessage("กรุณาตรวจสอบข้อมูลที่ไม่ถูกต้อง");
      return;
    }
    const data = {
      name_th: form.name_th.trim(),
      name_en: form.name_en.trim(),
      category_id: form.category_id,
      vendor_type_id: form.vendor_type_id,
      serving_desc: form.serving_desc.trim(),
      is_vegetarian: Boolean(form.is_vegetarian),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      image_thumb: `images/menus/${menuId}_thumb.webp`,
      image_detail: `images/menus/${menuId}_detail.webp`,
      source_id: form.source_id,
      verification_status: form.verification_status,
      updated_at: todayKey(),
      ...Object.fromEntries(NUMBER_FIELDS.map((k) => [k, Number(form[k])])),
    };
    if (!data.tags.length) data.tags = [data.name_th];
    setSaving(true);
    setMessage("");
    try {
      await onSubmit(data);
    } catch (err) {
      console.error(err);
      setMessage(
        err?.code === "PERMISSION_DENIED"
          ? "ระบบปฏิเสธการบันทึก (Security Rules) : บัญชีนี้ไม่มีสิทธิ์ หรือข้อมูลไม่ผ่านการตรวจสอบ"
          : "บันทึกไม่สำเร็จ กรุณาลองใหม่",
      );
      setSaving(false);
    }
  };

  const field = (k, label, props = {}) => (
    <label className="block">
      <span className="label">{label}</span>
      <input className={`input ${errors[k] ? "border-red-400" : ""}`} value={form[k]} onChange={set(k)} {...props} />
      {errors[k] && <p className="field-error">{errors[k]}</p>}
    </label>
  );
  const select = (k, label, options) => (
    <label className="block">
      <span className="label">{label}</span>
      <select className={`input ${errors[k] ? "border-red-400" : ""}`} value={form[k]} onChange={set(k)}>
        <option value="">เลือก</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
      {errors[k] && <p className="field-error">{errors[k]}</p>}
    </label>
  );

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card space-y-3 p-4">
          <h2 className="font-semibold">ข้อมูลทั่วไป</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {field("name_th", "ชื่อภาษาไทย *")}
            {field("name_en", "ชื่อภาษาอังกฤษ *")}
            {select("category_id", "หมวดอาหาร *", categories.map((c) => ({ id: c.id, label: c.name_th })))}
            {select("vendor_type_id", "ประเภทร้าน *", vendorTypes.map((v) => ({ id: v.id, label: v.name_th })))}
            {field("serving_desc", "หน่วยบริโภค *")}
            {field("serving_g", "น้ำหนัก (กรัม) *", { type: "number", inputMode: "decimal" })}
            {field("price_thb", "ราคา (บาท) *", { type: "number", inputMode: "decimal" })}
            <label className="block">
              <span className="label">ระดับความเผ็ด</span>
              <select className="input" value={form.spicy_level} onChange={set("spicy_level")}>
                {[0, 1, 2, 3].map((n) => <option key={n} value={String(n)}>{n}</option>)}
              </select>
            </label>
          </div>
          {field("tags", "คำค้นเพิ่มเติม (คั่นด้วยจุลภาค)")}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-brand-700" checked={form.is_vegetarian} onChange={set("is_vegetarian")} />
            เหมาะกับมังสวิรัติ
          </label>
        </section>
        <section className="card space-y-3 p-4">
          <h2 className="font-semibold">ค่าโภชนาการต่อหน่วยบริโภค</h2>
          <div className="grid grid-cols-2 gap-3">
            {NUTRIENT_KEYS.map((k) => (
              <Fragment key={k}>
                {field(k, `${NUTRIENT_TH[k]} (${UNIT_TH[k.split("_").pop()] ?? ""}) *`, { type: "number", step: "0.1", inputMode: "decimal" })}
              </Fragment>
            ))}
          </div>
          <div className={`rounded-lg border p-3 text-sm ${energy.ok ? "border-green-200 bg-green-50 text-green-800" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
            <b>ตรวจสอบอัตโนมัติ</b>
            <p>
              4P + 9F + 4C = {fmt(energy.calc)} kcal เทียบกับที่ระบุ {form.energy_kcal || "–"} kcal
              {energy.diffPct != null && ` (ต่างกัน ${fmt(energy.diffPct)}%)`} · ยอมรับได้ไม่เกิน ±8%
            </p>
            {!energy.ok && energy.diffPct != null && (
              <label className="mt-2 flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4" checked={ackEnergy} onChange={(e) => setAckEnergy(e.target.checked)} />
                ยืนยันว่าค่าถูกต้องตามแหล่งข้อมูล (เช่น อาหารที่มีใยอาหารหรือน้ำตาลแอลกอฮอล์สูง)
              </label>
            )}
            {errors.energy && <p className="field-error">{errors.energy}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {select("source_id", "แหล่งข้อมูล *", sources.map((s) => ({ id: s.id, label: `${s.id} ${s.name}` })))}
            <label className="block">
              <span className="label">สถานะการสอบทาน</span>
              <select className="input" value={form.verification_status} onChange={set("verification_status")}>
                {["PENDING", "VERIFIED", "REJECTED"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </div>
          <p className="text-xs text-slate-500">
            ไฟล์ภาพกำหนดจากรหัสอัตโนมัติ : images/menus/{menuId}_thumb.webp และ {menuId}_detail.webp (อัปโหลดภาพเป็น Future Feature)
          </p>
        </section>
      </div>
      {message && <p role="alert" className="text-sm text-red-700">{message}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel} disabled={saving}>ยกเลิก</Button>
        <Button type="submit" disabled={saving}>{saving ? "กำลังบันทึก…" : "บันทึก"}</Button>
      </div>
    </form>
  );
}
