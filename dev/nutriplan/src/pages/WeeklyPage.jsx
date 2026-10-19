import { useSearchParams } from "react-router-dom";
import Button from "../components/common/Button";
import StateView from "../components/common/StateView";
import WeeklyChart from "../components/features/meal/WeeklyChart";
import WeeklyStats from "../components/features/meal/WeeklyStats";
import { useAuth } from "../context/AuthContext";
import { useMealLogRange } from "../hooks/useMealLogs";
import { usePageTitle } from "../hooks/usePageTitle";
import { useProfile } from "../hooks/useProfile";
import { addDays, isValidDateKey, thaiDate, todayKey } from "../utils/format";
import { DEFAULT_TARGETS, sumLogs } from "../utils/nutrition";

/** P12 สรุปรายสัปดาห์ (7 วันล่าสุดจนถึงวันที่เลือก) */
export default function WeeklyPage() {
  usePageTitle("สรุปรายสัปดาห์");
  const { uid } = useAuth();
  const [params, setParams] = useSearchParams();
  const raw = params.get("end");
  const end = isValidDateKey(raw) && raw <= todayKey() ? raw : todayKey();
  const start = addDays(end, -6);
  const range = useMealLogRange(uid, start, end);
  const prof = useProfile(uid);
  const tg = prof.targets ?? DEFAULT_TARGETS;

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i);
    const logs = range.days[date] ?? [];
    const t = sumLogs(logs);
    return { date, count: logs.length, kcal: t.energy_kcal, protein: t.protein_g, sodium: t.sodium_mg, price: t.price_thb };
  });

  const go = (d) => setParams(d === todayKey() ? {} : { end: d });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">สรุปรายสัปดาห์</h1>
          <p className="text-slate-500">
            {thaiDate(start)} – {thaiDate(end)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => go(addDays(end, -7))}>‹ 7 วันก่อน</Button>
          <Button size="sm" variant="ghost" onClick={() => go(addDays(end, 7))} disabled={end >= todayKey()}>7 วันถัดไป ›</Button>
        </div>
      </div>

      {range.status === "error" ? (
        <StateView kind="error" onRetry={range.retry} />
      ) : range.status === "loading" ? (
        <StateView kind="loading" variant="block" />
      ) : range.status === "empty" ? (
        <StateView
          kind="empty"
          message="ยังไม่มีบันทึกในช่วง 7 วันนี้"
          detail="บันทึกมื้ออาหารอย่างน้อย 2–3 วันเพื่อดูแนวโน้มของสัปดาห์"
          action={<Button size="sm" to="/today">ไปบันทึกวันนี้</Button>}
        />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="card p-4">
            <h2 className="mb-2 font-semibold">พลังงานรายวัน (kcal)</h2>
            <WeeklyChart days={days} target={tg.target_kcal} />
          </section>
          <section>
            <WeeklyStats days={days} target={tg.target_kcal} protein={tg.protein_g} budget={prof.profile?.budget_per_day_thb} />
          </section>
        </div>
      )}
    </div>
  );
}
