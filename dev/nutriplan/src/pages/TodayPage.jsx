import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../components/common/Button";
import DateNavigator from "../components/common/DateNavigator";
import ProgressBar from "../components/common/ProgressBar";
import StateView from "../components/common/StateView";
import MealLogList from "../components/features/meal/MealLogList";
import NutrientProgressList from "../components/features/meal/NutrientProgressList";
import WarningList from "../components/features/meal/WarningList";
import TargetSummary from "../components/features/planner/TargetSummary";
import { useAuth } from "../context/AuthContext";
import { useMealLogs } from "../hooks/useMealLogs";
import { useMenus } from "../hooks/useMenus";
import { useNutrientLimits } from "../hooks/useNutrientLimits";
import { usePageTitle } from "../hooks/usePageTitle";
import { useProfile } from "../hooks/useProfile";
import { removeMealLog } from "../services/mealLogService";
import { fmt, isValidDateKey, todayKey } from "../utils/format";
import { DEFAULT_TARGETS, evaluateDay, levelOf, sumLogs } from "../utils/nutrition";

/** P07 บันทึกวันนี้ /today?date=YYYY-MM-DD */
export default function TodayPage() {
  usePageTitle("บันทึกวันนี้");
  const { uid } = useAuth();
  const [params, setParams] = useSearchParams();
  const raw = params.get("date");
  const date = isValidDateKey(raw) && raw <= todayKey() ? raw : todayKey();
  const setDate = (d) => setParams(d === todayKey() ? {} : { date: d });

  const logs = useMealLogs(uid, date);
  const prof = useProfile(uid);
  const limits = useNutrientLimits();
  const menus = useMenus();
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  const tg = prof.targets ?? DEFAULT_TARGETS;
  const totals = sumLogs(logs.logs);
  const warnings = logs.logs.length ? evaluateDay(totals, limits.limits, tg) : [];
  const budget = prof.profile?.budget_per_day_thb;

  const onRemove = async (log) => {
    setRemovingId(log.id);
    setError("");
    try {
      await removeMealLog(uid, date, log.id);
    } catch (e) {
      console.error(e);
      setError("ลบรายการไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setRemovingId(null);
    }
  };

  const loading = logs.status === "loading" || prof.status === "loading";
  const failed = logs.status === "error" || prof.status === "error";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">บันทึกมื้ออาหาร</h1>
        <Link to="/weekly" className="text-sm text-brand-700 hover:underline">ดูสรุปรายสัปดาห์ ›</Link>
      </div>
      <DateNavigator date={date} onChange={setDate} />

      {!prof.targets && prof.status !== "loading" && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm text-brand-900">
          <span>ยังไม่ได้ตั้งเป้าหมาย ระบบใช้ค่าอ้างอิง 2,000 kcal ชั่วคราว</span>
          <Button to="/profile" size="sm">ตั้งเป้าหมาย</Button>
        </div>
      )}

      {failed ? (
        <StateView
          kind="error"
          message="เชื่อมต่อฐานข้อมูลไม่สำเร็จ"
          onRetry={() => {
            logs.retry();
            prof.retry();
          }}
        />
      ) : loading ? (
        <StateView kind="loading" variant="list" count={3} />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-5">
            <section className="card space-y-4 p-4 md:p-5" aria-label="สรุปวันนี้">
              <TargetSummary targets={tg} compact />
              <div>
                <div className="text-3xl font-bold tabular-nums">
                  {fmt(totals.energy_kcal)} <span className="text-base font-normal text-slate-500">/ {fmt(tg.target_kcal)} kcal</span>
                </div>
                <div className="mt-2">
                  <ProgressBar value={totals.energy_kcal} max={tg.target_kcal} level={levelOf(totals.energy_kcal, { type: "target", value: tg.target_kcal })} label="พลังงาน" />
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {totals.energy_kcal <= tg.target_kcal
                    ? `เหลืออีก ${fmt(tg.target_kcal - totals.energy_kcal)} kcal`
                    : `เกินเป้าหมาย ${fmt(totals.energy_kcal - tg.target_kcal)} kcal`}
                  {" · "}ใช้จ่าย {fmt(totals.price_thb)}
                  {budget ? ` จาก ${fmt(budget)}` : ""} บาท
                </p>
              </div>
              {limits.status === "ok" && <NutrientProgressList totals={totals} limits={limits.limits} targets={tg} />}
            </section>
            <section>
              <h2 className="mb-2 text-lg font-bold">คำเตือน</h2>
              {logs.logs.length ? (
                <WarningList warnings={warnings} />
              ) : (
                <p className="text-sm text-slate-500">บันทึกมื้ออาหารเพื่อดูคำเตือนของวันนี้</p>
              )}
            </section>
          </div>
          <section>
            <h2 className="mb-2 text-lg font-bold">มื้ออาหารที่บันทึก</h2>
            {error && <p role="alert" className="field-error mb-2">{error}</p>}
            {logs.logs.length === 0 && (
              <div className="card mb-3 flex items-center gap-3 p-4 text-sm text-slate-600">
                <span>ยังไม่มีบันทึกของวันนี้ ค้นหาเมนูแล้วกด “เพิ่มลงมื้ออาหาร” ที่หน้ารายละเอียดเมนู</span>
              </div>
            )}
            <MealLogList logs={logs.logs} menusById={menus.byId} onRemove={onRemove} removingId={removingId} />
            <Button to="/search" block className="mt-3">+ บันทึกมื้ออาหาร</Button>
          </section>
        </div>
      )}
    </div>
  );
}
