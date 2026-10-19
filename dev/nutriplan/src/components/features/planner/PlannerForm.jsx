import { useState } from "react";
import Button from "../../common/Button";

/** เงื่อนไขการวางแผน : พลังงานเป้าหมาย งบประมาณ มังสวิรัติ ไม่เผ็ด */
export default function PlannerForm({ defaults, onGenerate, busy }) {
  const [target, setTarget] = useState(String(defaults.target));
  const [budget, setBudget] = useState(String(defaults.budget));
  const [vegOnly, setVegOnly] = useState(false);
  const [noSpicy, setNoSpicy] = useState(false);
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const t = Number(target);
    const b = Number(budget);
    const er = {};
    if (!(t >= 800 && t <= 5000)) er.target = "พลังงานต้องอยู่ระหว่าง 800–5,000 kcal";
    if (!(b >= 30 && b <= 2000)) er.budget = "งบประมาณต้องอยู่ระหว่าง 30–2,000 บาท";
    setErrors(er);
    if (Object.keys(er).length) return;
    onGenerate({ target: t, budget: b, vegOnly, noSpicy });
  };

  return (
    <form onSubmit={submit} noValidate className="card space-y-3 p-4 md:p-5">
      <div className="grid grid-cols-2 gap-3">
        <label>
          <span className="label">พลังงานเป้าหมาย (kcal)</span>
          <input className="input" type="number" inputMode="numeric" value={target} onChange={(e) => setTarget(e.target.value)} />
          {errors.target && <p className="field-error">{errors.target}</p>}
        </label>
        <label>
          <span className="label">งบประมาณต่อวัน (บาท)</span>
          <input className="input" type="number" inputMode="numeric" value={budget} onChange={(e) => setBudget(e.target.value)} />
          {errors.budget && <p className="field-error">{errors.budget}</p>}
        </label>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" className="h-4 w-4 accent-brand-700" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} />
          เฉพาะมังสวิรัติ
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" className="h-4 w-4 accent-brand-700" checked={noSpicy} onChange={(e) => setNoSpicy(e.target.checked)} />
          ไม่เผ็ด
        </label>
      </div>
      <p className="text-xs text-slate-500">ระบบให้ความสำคัญกับโซเดียมไม่เกิน 2,000 มก. และโปรตีนให้ครบเป้าหมายเสมอ</p>
      <Button type="submit" block disabled={busy}>
        {busy ? "กำลังคำนวณ…" : "สร้างแผนใหม่"}
      </Button>
    </form>
  );
}
