import { fmt, thaiShortDate } from "../../../utils/format";

/** สถิติ 7 วันและตารางรายวัน (ตารางเป็นมุมมองข้อมูลของกราฟด้วย) */
export default function WeeklyStats({ days, target, protein, budget }) {
  const logged = days.filter((d) => d.count > 0);
  const n = logged.length;
  const avg = (k) => (n ? logged.reduce((a, d) => a + d[k], 0) / n : 0);
  const rows = [
    ["วันที่มีการบันทึก", `${n} จาก ${days.length} วัน`],
    ["พลังงานเฉลี่ยต่อวัน (เฉพาะวันที่บันทึก)", `${fmt(avg("kcal"))} kcal`],
    ["วันที่พลังงานอยู่ในช่วง ±10% ของเป้าหมาย", `${logged.filter((d) => Math.abs(d.kcal - target) <= target * 0.1).length} วัน`],
    ["วันที่โซเดียมเกิน 2,000 มก.", `${logged.filter((d) => d.sodium > 2000).length} วัน`],
    ["วันที่ได้โปรตีนครบเป้าหมาย", `${logged.filter((d) => d.protein >= protein).length} วัน`],
    ["ค่าอาหารเฉลี่ยต่อวัน", `${fmt(avg("price"))} บาท${budget ? ` (งบ ${fmt(budget)} บาท)` : ""}`],
  ];
  return (
    <div className="space-y-4">
      <dl className="card divide-y divide-slate-100">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
            <dt className="text-slate-600">{k}</dt>
            <dd className="text-right font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      <details className="card">
        <summary className="cursor-pointer px-4 py-2.5 text-sm font-medium text-brand-700">ดูตารางรายวัน</summary>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">วันที่</th>
                <th className="px-3 py-2 text-right">พลังงาน (kcal)</th>
                <th className="px-3 py-2 text-right">โปรตีน (ก.)</th>
                <th className="px-3 py-2 text-right">โซเดียม (มก.)</th>
                <th className="px-3 py-2 text-right">ค่าอาหาร (บาท)</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d) => (
                <tr key={d.date} className="border-t border-slate-100 tabular-nums">
                  <td className="px-3 py-2">{thaiShortDate(d.date)}</td>
                  <td className="px-3 py-2 text-right">{d.count ? fmt(d.kcal) : "–"}</td>
                  <td className="px-3 py-2 text-right">{d.count ? fmt(d.protein) : "–"}</td>
                  <td className={`px-3 py-2 text-right ${d.sodium > 2000 ? "font-semibold text-red-700" : ""}`}>{d.count ? fmt(d.sodium) : "–"}</td>
                  <td className="px-3 py-2 text-right">{d.count ? fmt(d.price) : "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
