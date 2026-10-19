import { fmt } from "../../../utils/format";
import { levelOf, limitFor, UNIT_TH } from "../../../utils/nutrition";
import ProgressBar from "../../common/ProgressBar";

const LEVEL_TEXT = { ok: "", warn: "ใกล้เกณฑ์", bad: "เกินเกณฑ์" };

/** แถบความคืบหน้ารายสารอาหาร (ไม่แสดงสารอาหารประเภท info) */
export default function NutrientProgressList({ totals, limits, targets }) {
  return (
    <ul className="space-y-3">
      {limits
        .filter((l) => l.limit_type !== "info")
        .map((l) => {
          const lim = limitFor(l, targets);
          const v = totals[l.id] ?? 0;
          const level = levelOf(v, lim);
          const kind = lim.type === "max" ? "ไม่เกิน" : lim.type === "min" ? "อย่างน้อย" : "เป้าหมาย";
          const note =
            lim.type === "min" && level === "warn" ? "ยังน้อย" : lim.type === "target" && level === "warn" ? "เกินเป้าหมาย" : LEVEL_TEXT[level];
          return (
            <li key={l.id}>
              <div className="mb-1 flex justify-between gap-2 text-sm">
                <span>
                  {l.name_th}
                  {note && (
                    <span className={`ml-2 text-xs font-semibold ${level === "bad" ? "text-red-700" : "text-amber-700"}`}>
                      {note}
                    </span>
                  )}
                </span>
                <span className="text-slate-600 tabular-nums">
                  {fmt(v)} / {kind} {fmt(lim.value)} {UNIT_TH[l.unit]}
                </span>
              </div>
              <ProgressBar value={v} max={lim.value} level={level} label={l.name_th} />
            </li>
          );
        })}
    </ul>
  );
}
