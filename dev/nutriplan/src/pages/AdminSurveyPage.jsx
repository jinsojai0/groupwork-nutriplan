import { useMemo } from "react";
import Button from "../components/common/Button";
import StateView from "../components/common/StateView";
import SurveySummary from "../components/features/survey/SurveySummary";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAllSurveys } from "../hooks/useSurvey";
import { summarize, toCsv } from "../utils/survey";

/** สรุปผลแบบสอบถาม /admin/survey (editor, admin) */
export default function AdminSurveyPage() {
  usePageTitle("ผลแบบสอบถามความพึงพอใจ");
  const all = useAllSurveys();
  const summary = useMemo(() => summarize(all.responses), [all.responses]);

  const download = () => {
    const blob = new Blob([toCsv(all.responses)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nutriplan-survey-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">ผลแบบสอบถามความพึงพอใจ</h1>
          <p className="text-sm text-slate-500">อัปเดตทันทีเมื่อมีผู้ตอบเพิ่ม ไม่แสดงข้อมูลที่ระบุตัวผู้ตอบ</p>
        </div>
        {all.status === "ok" && (
          <Button variant="ghost" size="sm" onClick={download}>
            ดาวน์โหลด CSV
          </Button>
        )}
      </div>
      {all.status === "error" ? (
        <StateView
          kind="error"
          onRetry={all.retry}
          detail={all.error?.code === "PERMISSION_DENIED" ? "บัญชีนี้ไม่มีสิทธิ์ดูผลแบบสอบถาม" : undefined}
        />
      ) : all.status === "loading" ? (
        <StateView kind="loading" variant="block" />
      ) : all.status === "empty" ? (
        <StateView kind="empty" message="ยังไม่มีผู้ตอบแบบสอบถาม" detail="ชวนสมาชิกเปิดหน้า /survey เพื่อตอบแบบสอบถาม" />
      ) : (
        <SurveySummary summary={summary} />
      )}
    </div>
  );
}
