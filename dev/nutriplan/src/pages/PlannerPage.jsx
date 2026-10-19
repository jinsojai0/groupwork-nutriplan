import { useState } from "react";
import Button from "../components/common/Button";
import StateView from "../components/common/StateView";
import MealPlanCard from "../components/features/planner/MealPlanCard";
import MealPlanList from "../components/features/planner/MealPlanList";
import PlanNotice from "../components/features/planner/PlanNotice";
import PlannerForm from "../components/features/planner/PlannerForm";
import { useAuth } from "../context/AuthContext";
import { useMealPlan } from "../hooks/useMealPlan";
import { useMenus } from "../hooks/useMenus";
import { usePageTitle } from "../hooks/usePageTitle";
import { useProfile } from "../hooks/useProfile";
import { removeMealPlan, saveMealPlan } from "../services/mealPlanService";
import { thaiDate, todayKey } from "../utils/format";
import { generatePlans, SODIUM_LIMIT } from "../utils/planner";

/** P08 วางแผนมื้ออาหาร */
export default function PlannerPage() {
  usePageTitle("วางแผนมื้ออาหาร");
  const { uid } = useAuth();
  const menus = useMenus();
  const prof = useProfile(uid);
  const today = todayKey();
  const saved = useMealPlan(uid, today);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [savingIndex, setSavingIndex] = useState(null);
  const [savedIndex, setSavedIndex] = useState(null);
  const [error, setError] = useState("");

  if (menus.status === "error" || prof.status === "error")
    return <StateView kind="error" onRetry={() => { menus.retry(); prof.retry(); }} />;
  if (menus.status === "loading" || prof.status === "loading") return <StateView kind="loading" variant="block" />;

  const targets = prof.targets;
  const defaults = {
    target: targets?.target_kcal ?? 2000,
    budget: prof.profile?.budget_per_day_thb ?? 150,
  };

  const onGenerate = (opts) => {
    setBusy(true);
    setSavedIndex(null);
    setError("");
    // ให้หน้าจอแสดง "กำลังคำนวณ" ก่อนเริ่มคำนวณ
    setTimeout(() => {
      const res = generatePlans({ menus: menus.menus, protein: targets?.protein_g ?? 50, ...opts });
      setResult({ ...res, opts });
      setBusy(false);
    }, 30);
  };

  const onSave = async (plan, i) => {
    setSavingIndex(i);
    setError("");
    try {
      await saveMealPlan(uid, today, plan);
      setSavedIndex(i);
    } catch (e) {
      console.error(e);
      setError("บันทึกแผนไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setSavingIndex(null);
    }
  };

  const savedPlan = saved.plan
    ? {
        slots: { breakfast: [], lunch: [], dinner: [], snack: [], ...saved.plan.slots },
        k: saved.plan.total_kcal,
        p: saved.plan.total_protein_g ?? 0,
        na: saved.plan.total_sodium_mg,
        c: saved.plan.total_price,
      }
    : null;

  const notice =
    result && (result.plans.length === 0 ? "budget" : result.plans.every((p) => p.na > SODIUM_LIMIT) ? "sodium" : null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">วางแผนมื้ออาหาร</h1>
        <p className="text-slate-500">ระบบจัดชุดอาหาร 1 วันจากเมนูจริงให้ใกล้เป้าหมายพลังงานและไม่เกินงบประมาณ</p>
      </div>

      {!targets && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm text-brand-900">
          <span>ยังไม่ได้ตั้งเป้าหมาย ระบบใช้ค่าเริ่มต้น 2,000 kcal และงบ 150 บาท</span>
          <Button to="/profile" size="sm">ตั้งเป้าหมาย</Button>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <PlannerForm defaults={defaults} onGenerate={onGenerate} busy={busy} />
          {savedPlan && (
            <section>
              <h2 className="mb-2 font-semibold">แผนที่บันทึกไว้สำหรับ {thaiDate(today)}</h2>
              <MealPlanCard plan={savedPlan} title="แผนของวันนี้" menusById={menus.byId} />
              <Button
                variant="danger-ghost"
                size="sm"
                className="mt-2"
                onClick={() => removeMealPlan(uid, today).then(() => setSavedIndex(null)).catch(() => setError("ลบแผนไม่สำเร็จ"))}
              >
                ลบแผนนี้
              </Button>
            </section>
          )}
        </div>
        <section aria-live="polite" className="space-y-3">
          {error && <p role="alert" className="field-error">{error}</p>}
          {busy ? (
            <StateView kind="loading" variant="list" count={3} message="กำลังคำนวณชุดมื้ออาหาร…" />
          ) : !result ? (
            <div className="card p-6 text-center text-slate-500">
              ตรวจเงื่อนไขทางซ้าย แล้วกด “สร้างแผนใหม่” เพื่อดูแผนมื้ออาหาร 3 แผน
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500">
                ตรวจสอบ {result.checked.toLocaleString("th-TH")} ชุดค่าผสมจากเมนูจริง {menus.menus.length} รายการ
                พบ {result.inBudget.toLocaleString("th-TH")} ชุดที่อยู่ในงบ {result.opts.budget} บาท แล้วเลือก {result.plans.length} แผนที่ดีที่สุด
              </p>
              {notice && <PlanNotice kind={notice} />}
              <MealPlanList plans={result.plans} menusById={menus.byId} onSave={onSave} savingIndex={savingIndex} savedIndex={savedIndex} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
