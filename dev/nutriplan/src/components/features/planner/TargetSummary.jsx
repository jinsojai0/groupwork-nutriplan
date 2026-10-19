import { fmt } from "../../../utils/format";

/** แสดงการคำนวณเป้าหมายทีละขั้น หรือแบบย่อ (compact) */
export default function TargetSummary({ targets, profile, activityMap = {}, goalMap = {}, compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">{targets.isDefault ? "ค่าอ้างอิง (ยังไม่ได้ตั้งเป้าหมาย)" : "เป้าหมายพลังงานของคุณ"}</span>
        <b>{fmt(targets.target_kcal)} kcal</b>
      </div>
    );
  }
  const age = targets.age;
  const sexConst = profile.sex === "male" ? "+ 5" : "− 161";
  const act = activityMap[profile.activity_id];
  const goal = goalMap[profile.goal_id];
  const adj = goal?.kcal_adjust ?? 0;
  const rows = [
    [`BMR = 10×${fmt(profile.weight_kg)} + 6.25×${fmt(profile.height_cm)} − 5×${age} ${sexConst}`, `${fmt(targets.bmr)} kcal`],
    [`TDEE = BMR × ${act?.pal_factor ?? "-"} (${act?.name_th ?? "-"})`, `${fmt(targets.tdee)} kcal`],
    [`เป้าหมาย = TDEE ${adj >= 0 ? "+" : "−"} ${Math.abs(adj)} (${goal?.name_th ?? "-"})`, `${fmt(targets.target_kcal)} kcal`],
    [`โปรตีน = ${fmt(profile.weight_kg)} กก. × 1.0 ก.`, `${fmt(targets.protein_g)} ก.`],
  ];
  return (
    <div className="card p-4 md:p-5">
      <h2 className="font-semibold">ผลการคำนวณ (สมการ Mifflin-St Jeor)</h2>
      <p className="text-sm text-slate-500">อายุ {age} ปี · งบประมาณ {fmt(profile.budget_per_day_thb)} บาทต่อวัน</p>
      <table className="mt-3 w-full text-sm">
        <tbody>
          {rows.map(([k, v], i) => (
            <tr key={k} className="border-t border-slate-100">
              <td className="py-2 pr-2 text-slate-600">{k}</td>
              <td className={`py-2 text-right whitespace-nowrap tabular-nums ${i === 2 ? "text-lg font-bold text-brand-700" : "font-semibold"}`}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
