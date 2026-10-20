import { useMemo } from "react";
import { subscribeAllSurveys, subscribeMySurvey } from "../services/surveyService";
import { useRealtime } from "./useRealtime";

/** คำตอบแบบสอบถามของผู้ใช้ปัจจุบัน (null เมื่อยังไม่เคยตอบ) */
export function useMySurvey(uid) {
  const res = useRealtime(uid ? `survey_responses/${uid}` : null, (ok, err) => subscribeMySurvey(uid, ok, err));
  return { ...res, response: res.data ?? null };
}

/** คำตอบทั้งหมด สำหรับหน้าสรุปผลของผู้ดูแล */
export function useAllSurveys() {
  const res = useRealtime("survey_responses", subscribeAllSurveys);
  const responses = useMemo(() => res.data ?? [], [res.data]);
  return { ...res, responses };
}
