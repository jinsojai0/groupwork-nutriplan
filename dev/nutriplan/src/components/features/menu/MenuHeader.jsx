import { Link } from "react-router-dom";
import { nutrientBadge } from "../../../utils/nutrition";

/** ชื่อ หมวด ความเผ็ด ราคา */
export default function MenuHeader({ menu, category, vendorType }) {
  const badge = nutrientBadge(menu);
  return (
    <div>
      <h1 className="text-2xl leading-tight font-bold md:text-3xl">{menu.name_th}</h1>
      <p className="text-slate-500">{menu.name_en}</p>
      <div className="my-3 flex flex-wrap gap-2">
        {category && (
          <Link to={`/menus?category=${category.id}`} className="chip">
            {category.name_th}
          </Link>
        )}
        {menu.spicy_level > 0 && (
          <span className="chip border-orange-300 text-orange-700" title={`ความเผ็ดระดับ ${menu.spicy_level} จาก 3`}>
            เผ็ด {"●".repeat(menu.spicy_level)}
          </span>
        )}
        {menu.is_vegetarian && <span className="chip border-green-300 text-green-700">มังสวิรัติ</span>}
        {badge && (
          <span className={`chip ${badge.level === "bad" ? "border-red-300 text-red-700" : "border-green-300 text-green-700"}`}>
            {badge.text}
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span>
          ราคาโดยประมาณ <b className="text-lg">{menu.price_thb} บาท</b>
        </span>
        <span className="text-sm text-slate-500">
          {menu.serving_desc} · {menu.serving_g} กรัม{vendorType ? ` · ${vendorType.name_th}` : ""}
        </span>
      </div>
    </div>
  );
}
