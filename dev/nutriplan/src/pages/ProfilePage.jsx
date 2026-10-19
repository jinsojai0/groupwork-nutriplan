import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import StateView from "../components/common/StateView";
import TargetForm from "../components/features/planner/TargetForm";
import TargetSummary from "../components/features/planner/TargetSummary";
import { useAuth } from "../context/AuthContext";
import { useLookup } from "../hooks/useLookup";
import { useNutrientLimits } from "../hooks/useNutrientLimits";
import { usePageTitle } from "../hooks/usePageTitle";
import { useProfile } from "../hooks/useProfile";
import { deleteMyData, saveProfile } from "../services/userService";
import { calcTargets } from "../utils/nutrition";

/** P06 โปรไฟล์และเป้าหมาย พร้อมความยินยอมและการลบข้อมูลของฉัน */
export default function ProfilePage() {
  usePageTitle("โปรไฟล์และเป้าหมาย");
  const { uid, user } = useAuth();
  const navigate = useNavigate();
  const prof = useProfile(uid);
  const acts = useLookup("activity_levels");
  const goals = useLookup("health_goals");
  const limits = useNutrientLimits();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(null);
  const [formKey, setFormKey] = useState(0); // เปลี่ยนเมื่อลบข้อมูล เพื่อล้างฟอร์ม

  const statuses = [prof.status, acts.status, goals.status];
  if (statuses.includes("error"))
    return <StateView kind="error" onRetry={() => [prof, acts, goals].forEach((r) => r.retry())} />;
  if (statuses.includes("loading")) return <StateView kind="loading" variant="block" />;

  const proteinPerKg = limits.byKey.protein_g?.limit_value ?? 1;
  const onSave = (profile) => {
    const targets = calcTargets(profile, acts.map, goals.map, proteinPerKg);
    return saveProfile(uid, {
      profile,
      targets: { bmr: targets.bmr, tdee: targets.tdee, target_kcal: targets.target_kcal, protein_g: targets.protein_g },
      consentAt: prof.consentAt ?? new Date().toISOString(),
    });
  };

  const onDelete = async () => {
    setDeleting(true);
    setDeleteMsg(null);
    try {
      await deleteMyData(uid);
      setConfirmDelete(false);
      setFormKey((k) => k + 1);
      setDeleteMsg({ type: "ok", text: "ลบโปรไฟล์ บันทึกมื้ออาหาร แผนมื้ออาหาร และเมนูโปรดของคุณแล้ว" });
    } catch (e) {
      console.error(e);
      setDeleteMsg({ type: "error", text: "ลบข้อมูลไม่สำเร็จ กรุณาลองใหม่" });
    } finally {
      setDeleting(false);
    }
  };

  const summary = prof.profile ? { ...calcTargets(prof.profile, acts.map, goals.map, proteinPerKg), ...prof.targets } : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">โปรไฟล์และเป้าหมาย</h1>
        <p className="text-slate-500">
          {prof.userData?.display_name ?? user.displayName ?? ""} · {user.email}
        </p>
      </div>

      {!prof.profile && (
        <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-900">
          กรอกข้อมูลร่างกายเพื่อให้ระบบคำนวณพลังงานที่เหมาะกับคุณ ใช้เวลาไม่ถึง 1 นาที
          ผลลัพธ์จะใช้ในหน้าบันทึกวันนี้และการวางแผนมื้ออาหาร
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
        <TargetForm
          key={formKey}
          profile={prof.profile}
          consentAt={prof.consentAt}
          activityLevels={acts.list}
          healthGoals={goals.list}
          onSave={onSave}
        />
        <div className="space-y-4">
          {summary ? (
            <>
              <TargetSummary targets={summary} profile={prof.profile} activityMap={acts.map} goalMap={goals.map} />
              <div className="flex flex-wrap gap-2">
                <Button to="/today">ไปบันทึกมื้ออาหาร</Button>
                <Button to="/planner" variant="ghost">วางแผนมื้ออาหาร</Button>
              </div>
            </>
          ) : (
            <div className="card p-5 text-sm text-slate-500">ผลการคำนวณ BMR, TDEE และเป้าหมายพลังงานจะแสดงที่นี่หลังบันทึก</div>
          )}
        </div>
      </div>

      <section className="rounded-xl border border-red-200 bg-white p-4 md:p-5" aria-labelledby="delete-title">
        <h2 id="delete-title" className="font-semibold text-red-800">ลบข้อมูลของฉัน</h2>
        <p className="mt-1 text-sm text-slate-600">
          ลบโปรไฟล์ เป้าหมาย บันทึกมื้ออาหารทุกวัน แผนมื้ออาหาร และเมนูโปรดของบัญชีนี้ออกจากระบบอย่างถาวร
          (บัญชีสำหรับเข้าสู่ระบบยังอยู่ และเริ่มใช้งานใหม่ได้)
        </p>
        {deleteMsg && (
          <p role={deleteMsg.type === "error" ? "alert" : "status"} className={`mt-2 text-sm ${deleteMsg.type === "error" ? "text-red-700" : "text-green-700"}`}>
            {deleteMsg.text}
          </p>
        )}
        {!confirmDelete ? (
          <Button variant="danger-ghost" size="sm" className="mt-3" onClick={() => setConfirmDelete(true)}>
            ลบข้อมูลของฉัน
          </Button>
        ) : (
          <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm">
            <p className="font-semibold text-red-800">ยืนยันการลบ? ข้อมูลที่ลบแล้วกู้คืนไม่ได้</p>
            <div className="mt-2 flex gap-2">
              <Button variant="danger" size="sm" onClick={onDelete} disabled={deleting}>
                {deleting ? "กำลังลบ…" : "ยืนยันลบข้อมูลทั้งหมด"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                ยกเลิก
              </Button>
            </div>
          </div>
        )}
        {deleteMsg?.type === "ok" && (
          <Button variant="ghost" size="sm" className="mt-3" onClick={() => navigate("/")}>
            กลับหน้าแรก
          </Button>
        )}
      </section>
    </div>
  );
}
