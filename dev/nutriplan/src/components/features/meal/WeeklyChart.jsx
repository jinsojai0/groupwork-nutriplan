import { useState } from "react";
import { fmt, thaiShortDate, thaiWeekday } from "../../../utils/format";

/**
 * กราฟแท่งพลังงานรายวัน 7 วัน พร้อมเส้นเป้าหมาย
 * @param days [{ date, kcal, count }]
 */
export default function WeeklyChart({ days, target }) {
  const [hover, setHover] = useState(null);
  const W = 640;
  const H = 240;
  const pad = { top: 16, right: 12, bottom: 40, left: 44 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const maxVal = Math.max(target || 0, ...days.map((d) => d.kcal), 500) * 1.1;
  const step = maxVal > 2500 ? 1000 : 500;
  const ticks = [];
  for (let v = 0; v <= maxVal; v += step) ticks.push(v);
  const y = (v) => pad.top + innerH - (v / maxVal) * innerH;
  const slot = innerW / days.length;
  const barW = Math.min(36, slot * 0.5);

  return (
    <figure className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="กราฟพลังงานรายวันในสัปดาห์">
        {ticks.map((v) => (
          <g key={v}>
            <line x1={pad.left} x2={W - pad.right} y1={y(v)} y2={y(v)} stroke="#e2e8f0" strokeWidth="1" />
            <text x={pad.left - 8} y={y(v)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="#64748b">
              {v.toLocaleString("th-TH")}
            </text>
          </g>
        ))}
        {days.map((d, i) => {
          const cx = pad.left + slot * i + slot / 2;
          const h = Math.max(0, innerH - (y(d.kcal) - pad.top));
          const top = y(d.kcal);
          const r = Math.min(4, barW / 2, h);
          const path =
            h > 0
              ? `M${cx - barW / 2},${y(0)} V${top + r} Q${cx - barW / 2},${top} ${cx - barW / 2 + r},${top} H${cx + barW / 2 - r} Q${cx + barW / 2},${top} ${cx + barW / 2},${top + r} V${y(0)} Z`
              : "";
          return (
            <g key={d.date} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0}>
              <rect x={pad.left + slot * i} y={pad.top} width={slot} height={innerH} fill={hover === i ? "#f1f5f9" : "transparent"} />
              {path && <path d={path} fill="#2e6aa3" />}
              <text x={cx} y={H - pad.bottom + 16} textAnchor="middle" fontSize="12" fill="#334155">
                {thaiWeekday(d.date)}
              </text>
              <text x={cx} y={H - pad.bottom + 30} textAnchor="middle" fontSize="10" fill="#94a3b8">
                {thaiShortDate(d.date)}
              </text>
            </g>
          );
        })}
        <line x1={pad.left} x2={W - pad.right} y1={y(0)} y2={y(0)} stroke="#94a3b8" strokeWidth="1" />
        {target > 0 && (
          <g>
            <line x1={pad.left} x2={W - pad.right} y1={y(target)} y2={y(target)} stroke="#334155" strokeWidth="2" strokeDasharray="6 4" />
            <text x={pad.left + 6} y={y(target) - 6} fontSize="11" fill="#334155" stroke="#ffffff" strokeWidth="4" paintOrder="stroke">
              เป้าหมาย {fmt(target)} kcal
            </text>
          </g>
        )}
      </svg>
      {hover != null && (
        <div
          className="pointer-events-none absolute top-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md"
          style={{ left: `${((pad.left + slot * hover + slot / 2) / W) * 100}%`, transform: "translateX(-50%)" }}
        >
          <div className="font-semibold">{thaiShortDate(days[hover].date)}</div>
          <div className="tabular-nums">{fmt(days[hover].kcal)} kcal</div>
          <div className="text-xs text-slate-500">{days[hover].count} รายการ</div>
        </div>
      )}
    </figure>
  );
}
