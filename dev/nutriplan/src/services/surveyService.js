// แบบสอบถามความพึงพอใจ : survey_responses/{uid} (สมาชิกตอบได้ 1 ชุด แก้ไขได้)
import { ref, set } from "firebase/database";
import { db, subscribePath } from "./firebase";

export function subscribeMySurvey(uid, onData, onError) {
  return subscribePath(`survey_responses/${uid}`, onData, onError);
}

/** คำตอบทั้งหมด (Security Rules อนุญาตเฉพาะ editor และ admin) ไม่คืน uid เพื่อไม่ระบุตัวผู้ตอบ */
export function subscribeAllSurveys(onData, onError) {
  return subscribePath("survey_responses", onData, onError, (v) => Object.values(v ?? {}));
}

export function saveSurvey(uid, { answers, comment, submittedAt }) {
  const now = new Date().toISOString();
  const data = { answers, submitted_at: submittedAt ?? now, updated_at: now };
  const text = (comment ?? "").trim();
  if (text) data.comment = text;
  return set(ref(db, `survey_responses/${uid}`), data);
}
