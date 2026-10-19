import { Link } from "react-router-dom";
import { fmt } from "../../../utils/format";
import { MEAL_TYPES } from "../../../utils/nutrition";
import { SODIUM_LIMIT } from "../../../utils/planner";
import Button from "../../common/Button";

/** แผน 1 แผน พร้อมผลรวมพลังงาน โปรตีน โซเดียม และค่าใช้จ่าย */
export default function MealPlanCard({ plan, title, menusById, onSave, saving, saved }) {
  const okNa = plan.na <= SODIUM_LIMIT;
  return (
    <article className="card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">{title}</h3>
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${okNa ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}>
          {okNa ? "โซเดียมไม่เกินเกณฑ์" : `โซเดียมเกิน ${fmt(plan.na - SODIUM_LIMIT)} มก.`}
        </span>
      </div>
      <ul className="mt-3 space-y-1.5 text-sm">
        {MEAL_TYPES.map((t) => {
          const ids = plan.slots[t.id] ?? [];
          const kcal = ids.reduce((a, id) => a + (menusById[id]?.energy_kcal ?? 0), 0);
          return (
            <li key={t.id} className="flex gap-2">
              <span className="w-24 shrink-0 text-slate-500">{t.th}</span>
              <span className="flex-1">
                {ids.length
                  ? ids.map((id, i) => (
                      <span key={id}>
                        {i > 0 && " + "}
                        <Link to={`/menus/${id}`} className="hover:text-brand-700 hover:underline">
                          {menusById[id]?.name_th ?? id}
                        </Link>
                      </span>
                    ))
                  : <span className="text-slate-400">ไม่มีมื้อว่าง</span>}
              </span>
              <span className="text-slate-500 tabular-nums">{ids.length ? fmt(kcal) : ""}</span>
            </li>
          );
        })}
      </ul>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-sm sm:grid-cols-4">
        <div><dt className="text-slate-500">พลังงาน</dt><dd className="font-semibold tabular-nums">{fmt(plan.k)} kcal</dd></div>
        <div><dt className="text-slate-500">โปรตีน</dt><dd className="font-semibold tabular-nums">{fmt(plan.p)} ก.</dd></div>
        <div><dt className="text-slate-500">โซเดียม</dt><dd className={`font-semibold tabular-nums ${okNa ? "" : "text-red-700"}`}>{fmt(plan.na)} มก.</dd></div>
        <div><dt className="text-slate-500">ค่าใช้จ่าย</dt><dd className="font-semibold tabular-nums">{fmt(plan.c)} บาท</dd></div>
      </dl>
      {onSave && (
        <div className="mt-3">
          <Button size="sm" variant={saved ? "ghost" : "primary"} onClick={onSave} disabled={saving || saved}>
            {saved ? "บันทึกเป็นแผนของวันนี้แล้ว" : saving ? "กำลังบันทึก…" : "บันทึกแผนนี้"}
          </Button>
        </div>
      )}
    </article>
  );
}
