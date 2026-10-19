// เชื่อมต่อ Firebase (firebase 13.x, modular API)
// ค่าทั้งหมดอ่านจากไฟล์ .env (ขึ้นต้นด้วย VITE_) เพื่อไม่ให้ค่าการตั้งค่าอยู่ในโค้ดที่ push ขึ้น GitHub
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missing = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);
if (missing.length) {
  console.error(`[NutriPlan] ไม่พบค่าใน .env : ${missing.join(", ")} (ดู .env.example)`);
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.languageCode = "th"; // อีเมลรีเซ็ตรหัสผ่านเป็นภาษาไทย
export const db = getDatabase(app);

/** แปลง Object ที่ Key เป็นรหัสข้อมูลให้เป็น Array พร้อม id (ดูตาราง 2.2 ในงานที่ 5) */
export function toList(obj) {
  return Object.entries(obj ?? {}).map(([id, value]) => ({ id, ...value }));
}

/**
 * รอรับข้อมูลจาก path แบบ realtime
 * @returns ฟังก์ชันสำหรับยกเลิก Listener (เรียกใน cleanup ของ useEffect)
 */
export function subscribePath(path, onData, onError, transform = (v) => v) {
  return onValue(
    ref(db, path),
    (snap) => onData(transform(snap.val())),
    (error) => onError?.(error),
  );
}
