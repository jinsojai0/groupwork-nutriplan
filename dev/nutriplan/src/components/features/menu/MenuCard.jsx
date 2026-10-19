import { Link } from "react-router-dom";
import { fmt } from "../../../utils/format";
import { nutrientBadge } from "../../../utils/nutrition";
import ImageWithFallback from "../../common/ImageWithFallback";

const BADGE = {
  bad: "bg-red-50 text-red-700 border-red-200",
  ok: "bg-green-50 text-green-700 border-green-200",
};

/** สรุปเมนู 1 รายการ คลิกเพื่อไปหน้ารายละเอียด */
export default function MenuCard({ menu }) {
  const badge = nutrientBadge(menu);
  return (
    <Link
      to={`/menus/${menu.id}`}
      className="card group flex flex-col overflow-hidden transition hover:border-brand-300 hover:shadow-md"
    >
      <ImageWithFallback src={menu.image_thumb} alt={menu.name_th} className="aspect-[4/3] w-full" />
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 leading-snug font-semibold group-hover:text-brand-700">{menu.name_th}</h3>
        <div className="mt-auto flex items-baseline justify-between gap-2 pt-1 text-sm">
          <span className="font-semibold text-slate-800">{fmt(menu.energy_kcal)} kcal</span>
          <span className="text-slate-500">{menu.price_thb} บาท</span>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
          <span>โซเดียม {fmt(menu.sodium_mg)} มก.</span>
          {badge && <span className={`rounded-full border px-2 py-0.5 ${BADGE[badge.level]}`}>{badge.text}</span>}
        </div>
      </div>
    </Link>
  );
}
