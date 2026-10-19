import { SORT_OPTIONS } from "../../../utils/format";

/**
 * ตัวกรองหมวด มังสวิรัติ และการเรียงลำดับ
 * @param value { category, veg, sort }
 * @param onChange รับค่าที่เปลี่ยน (หน้าจอนำไปอัปเดต URL)
 */
export default function MenuFilterBar({ categories, value, onChange }) {
  const chip = (active) => `chip ${active ? "chip-on" : ""}`;
  return (
    <div className="space-y-3">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="หมวดอาหาร">
        <button type="button" className={chip(!value.category)} onClick={() => onChange({ category: "" })} aria-pressed={!value.category}>
          ทั้งหมด
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={chip(value.category === c.id)}
            aria-pressed={value.category === c.id}
            onClick={() => onChange({ category: c.id })}
          >
            {c.name_th}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 accent-brand-700"
            checked={value.veg}
            onChange={(e) => onChange({ veg: e.target.checked })}
          />
          เฉพาะมังสวิรัติ
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">เรียง</span>
          <select className="input w-auto py-1.5 text-sm" value={value.sort} onChange={(e) => onChange({ sort: e.target.value })}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
