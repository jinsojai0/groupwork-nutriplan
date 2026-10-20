// โปรไฟล์และเป้าหมายรายบุคคล (F03) : users/{uid}
import { ref, set, update } from "firebase/database";
import { db, subscribePath } from "./firebase";

export function subscribeUser(uid, onData, onError) {
  return subscribePath(`users/${uid}`, onData, onError);
}

export function createUserRecord(uid, { display_name, email }) {
  return update(ref(db, `users/${uid}`), { display_name, email });
}

/**
 * บันทึกโปรไฟล์ เป้าหมายที่คำนวณแล้ว และเวลาที่ผู้ใช้ให้ความยินยอมเก็บข้อมูลสุขภาพ
 * Security Rules ตรวจช่วงน้ำหนัก ส่วนสูง และรหัส activity_id / goal_id อีกชั้นหนึ่ง
 */
export function saveProfile(uid, { profile, targets, consentAt }) {
  return update(ref(db, `users/${uid}`), {
    profile,
    targets,
    consent_at: consentAt,
  });
}

export function setDisplayName(uid, displayName) {
  return set(ref(db, `users/${uid}/display_name`), displayName);
}

/**
 * ลบข้อมูลของฉัน : ลบข้อมูลส่วนตัวทุก Node ของผู้ใช้ในคำสั่งเดียว (multi-path update ด้วยค่า null)
 * รวมคำตอบแบบสอบถาม (survey_responses)
 * บัญชีสำหรับเข้าสู่ระบบยังอยู่ ผู้ใช้จึงเริ่มใช้งานใหม่ได้
 */
export function deleteMyData(uid) {
  return update(ref(db), {
    [`users/${uid}`]: null,
    [`meal_logs/${uid}`]: null,
    [`meal_plans/${uid}`]: null,
    [`favorites/${uid}`]: null,
    [`survey_responses/${uid}`]: null,
  });
}
