import StateView from "../components/common/StateView";
import SurveyForm from "../components/features/survey/SurveyForm";
import { useAuth } from "../context/AuthContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { useMySurvey } from "../hooks/useSurvey";
import { saveSurvey } from "../services/surveyService";

/** แบบสอบถามความพึงพอใจ /survey (สมาชิก) */
export default function SurveyPage() {
  usePageTitle("แบบสอบถามความพึงพอใจ");
  const { uid } = useAuth();
  const mine = useMySurvey(uid);

  if (mine.status === "error") return <StateView kind="error" onRetry={mine.retry} />;
  if (mine.status === "loading") return <StateView kind="loading" variant="list" count={4} />;

  const existing = mine.response;
  const onSubmit = ({ answers, comment }) =>
    saveSurvey(uid, { answers, comment, submittedAt: existing?.submitted_at });

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">แบบสอบถามความพึงพอใจ</h1>
        <p className="mt-1 text-slate-600">
          ช่วยประเมินการใช้งาน NutriPlan เพื่อนำไปปรับปรุงระบบ ใช้เวลาประมาณ 2 นาที เลือกระดับ 5 = มากที่สุด ถึง 1 = น้อยที่สุด
          ผลแสดงเป็นภาพรวมเท่านั้น ไม่ระบุตัวผู้ตอบ
        </p>
      </div>
      {existing && (
        <div className="rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm text-brand-900">
          คุณตอบแบบสอบถามแล้วเมื่อ{" "}
          {new Date(existing.updated_at ?? existing.submitted_at).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" })}{" "}
          แก้ไขคำตอบแล้วกดบันทึกได้
        </div>
      )}
      <SurveyForm initial={existing} onSubmit={onSubmit} />
    </div>
  );
}
