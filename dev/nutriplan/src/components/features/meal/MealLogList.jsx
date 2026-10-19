import { Link } from "react-router-dom";
import { fmt } from "../../../utils/format";
import { MEAL_TYPES } from "../../../utils/nutrition";
import Icon from "../../common/Icon";
import ImageWithFallback from "../../common/ImageWithFallback";

/** รายการมื้ออาหารแยกตามช่วงมื้อ */
export default function MealLogList({ logs, menusById, onRemove, removingId, addLink = "/search" }) {
  return (
    <div className="space-y-3">
      {MEAL_TYPES.map((t) => {
        const items = logs.filter((l) => l.meal_type === t.id);
        const kcal = items.reduce((a, l) => a + (l.snapshot?.energy_kcal ?? 0) * l.qty, 0);
        return (
          <section key={t.id} className="card p-3" aria-label={t.th}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {t.th}
                {items.length > 0 && <span className="ml-2 text-sm font-normal text-slate-500">{fmt(kcal)} kcal</span>}
              </h3>
              <Link to={addLink} className="chip text-xs">
                + เพิ่ม
              </Link>
            </div>
            {items.length === 0 ? (
              <p className="mt-1 text-sm text-slate-400">ยังไม่ได้บันทึก</p>
            ) : (
              <ul className="mt-2 divide-y divide-slate-100">
                {items.map((l) => {
                  const menu = menusById[l.menu_id];
                  const s = l.snapshot ?? {};
                  return (
                    <li key={l.id} className="flex items-center gap-3 py-2">
                      <ImageWithFallback src={menu?.image_thumb} alt="" className="h-11 w-14 shrink-0 rounded-md" />
                      <div className="min-w-0 flex-1">
                        <Link to={`/menus/${l.menu_id}`} className="block truncate font-medium hover:text-brand-700">
                          {s.name_th ?? menu?.name_th ?? l.menu_id}
                        </Link>
                        <span className="text-xs text-slate-500">
                          {l.qty} ที่ · {fmt((s.price_thb ?? 0) * l.qty)} บาท · โซเดียม {fmt((s.sodium_mg ?? 0) * l.qty)} มก.
                        </span>
                      </div>
                      <span className="text-sm font-semibold tabular-nums">{fmt((s.energy_kcal ?? 0) * l.qty)}</span>
                      <button
                        type="button"
                        onClick={() => onRemove(l)}
                        disabled={removingId === l.id}
                        className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
                        aria-label={`ลบ ${s.name_th ?? ""}`}
                      >
                        <Icon src="icons/ui/icon_ui_trash.svg" size={18} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
