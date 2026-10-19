import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { addMealLog } from "../../../services/mealLogService";
import { thaiDate, todayKey } from "../../../utils/format";
import { MEAL_TYPES } from "../../../utils/nutrition";
import Button from "../../common/Button";

const QTY_OPTIONS = [0.5, 1, 1.5, 2, 3];

function defaultMealType(d = new Date()) {
  const h = d.getHours();
  if (h < 10) return "breakfast";
  if (h < 14) return "lunch";
  if (h < 17) return "snack";
  return "dinner";
}

/** เลือกมื้อและจำนวนแล้วบันทึกลง meal_logs/{uid}/{date} */
export default function AddMealButton({ menu }) {
  const { uid } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [mealType, setMealType] = useState(defaultMealType);
  const [qty, setQty] = useState(1);
  const [date, setDate] = useState(todayKey);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedDate, setSavedDate] = useState(null);

  const start = () => {
    if (!uid) {
      navigate("/login", { state: { from: pathname } });
      return;
    }
    setSavedDate(null);
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!date || date > todayKey()) {
      setError("เลือกวันที่ไม่เกินวันนี้");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await addMealLog(uid, date, menu, mealType, qty);
      setSavedDate(date);
      setOpen(false);
    } catch (err) {
      console.error(err);
      setError("บันทึกไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setSaving(false);
    }
  };

  if (savedDate) {
    return (
      <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
        บันทึก “{menu.name_th}” ลง{MEAL_TYPES.find((m) => m.id === mealType)?.th} {thaiDate(savedDate)} แล้ว
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm" to={savedDate === todayKey() ? "/today" : `/today?date=${savedDate}`}>
            ดูบันทึกของวันนั้น
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSavedDate(null)}>
            บันทึกเพิ่ม
          </Button>
        </div>
      </div>
    );
  }

  if (!open) {
    return <Button onClick={start}>+ เพิ่มลงมื้ออาหาร</Button>;
  }

  return (
    <form onSubmit={save} className="card w-full space-y-3 p-4" aria-label="เพิ่มลงมื้ออาหาร">
      <fieldset>
        <legend className="label">มื้อ</legend>
        <div className="flex flex-wrap gap-2">
          {MEAL_TYPES.map((m) => (
            <label key={m.id} className={`chip cursor-pointer ${mealType === m.id ? "chip-on" : ""}`}>
              <input
                type="radio"
                name="meal_type"
                value={m.id}
                checked={mealType === m.id}
                onChange={() => setMealType(m.id)}
                className="sr-only"
              />
              {m.th}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid grid-cols-2 gap-3">
        <label>
          <span className="label">จำนวน ({menu.serving_desc})</span>
          <select className="input" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
            {QTY_OPTIONS.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">วันที่</span>
          <input type="date" className="input" value={date} max={todayKey()} onChange={(e) => setDate(e.target.value)} required />
        </label>
      </div>
      {error && <p className="field-error">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "กำลังบันทึก…" : "บันทึก"}
        </Button>
        <Button variant="ghost" onClick={() => setOpen(false)} disabled={saving}>
          ยกเลิก
        </Button>
      </div>
      <p className="text-xs text-slate-500">
        หรือดู <Link to="/today" className="underline">บันทึกวันนี้</Link>
      </p>
    </form>
  );
}
