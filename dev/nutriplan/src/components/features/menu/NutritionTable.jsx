import { fmt } from "../../../utils/format";
import { limitFor, percentOf, UNIT_TH } from "../../../utils/nutrition";

/** ค่าโภชนาการ 7 รายการต่อหน่วยบริโภค พร้อมร้อยละของเกณฑ์ต่อวัน */
export default function NutritionTable({ menu, limits, targets }) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm md:text-base">
        <thead className="bg-slate-50 text-left text-xs text-slate-500 md:text-sm">
          <tr>
            <th className="px-4 py-2 font-semibold">สารอาหาร</th>
            <th className="px-4 py-2 text-right font-semibold">ต่อ {menu.serving_desc}</th>
            <th className="px-4 py-2 text-right font-semibold">% ของเกณฑ์/วัน</th>
          </tr>
        </thead>
        <tbody>
          {limits.map((l) => {
            const lim = l.limit_type === "info" ? null : limitFor(l, targets);
            const v = menu[l.id] ?? 0;
            const share = lim ? percentOf(v, lim.value) : null;
            const high = lim?.type === "max" && v >= lim.value * 0.5;
            return (
              <tr key={l.id} className="border-t border-slate-100">
                <td className="px-4 py-2">{l.name_th}</td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {fmt(v)} {UNIT_TH[l.unit]}
                </td>
                <td className={`px-4 py-2 text-right tabular-nums ${high ? "font-bold text-red-700" : ""}`}>
                  {share == null ? "–" : `${share}%`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-500">
        {targets.isDefault
          ? "คิดจากค่าอ้างอิงพลังงาน 2,000 kcal และโปรตีน 50 ก. ต่อวัน ตั้งเป้าหมายของคุณเพื่อดูร้อยละที่ตรงกับร่างกายของคุณ"
          : `คิดจากเป้าหมายของคุณ ${fmt(targets.target_kcal)} kcal และโปรตีน ${fmt(targets.protein_g)} ก. ต่อวัน`}
      </p>
    </div>
  );
}
