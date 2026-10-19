// ระบบสมาชิก (F01) ด้วย Firebase Authentication แบบอีเมลและรหัสผ่าน
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, subscribePath } from "./firebase";
import { createUserRecord } from "./userService";

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function register({ displayName, email, password }) {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await updateProfile(cred.user, { displayName: displayName.trim() });
  // สร้าง users/{uid} ครั้งแรก (ตาราง 3.4 : F01 เขียน users/{uid})
  await createUserRecord(cred.user.uid, { display_name: displayName.trim(), email: email.trim() });
  return cred.user;
}

export async function login({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  return cred.user;
}

export function logout() {
  return signOut(auth);
}

/** ลืมรหัสผ่าน : Firebase ส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่อีเมล */
export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email.trim());
}

/** บทบาทของผู้ใช้จาก roles/{uid} (ไม่มีค่า = member) */
export function subscribeRole(uid, onData, onError) {
  return subscribePath(`roles/${uid}`, onData, onError, (v) => v ?? "member");
}

const AUTH_ERRORS = {
  "auth/invalid-email": "รูปแบบอีเมลไม่ถูกต้อง",
  "auth/missing-email": "กรุณากรอกอีเมล",
  "auth/invalid-credential": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  "auth/wrong-password": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  "auth/user-not-found": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  "auth/email-already-in-use": "อีเมลนี้สมัครสมาชิกแล้ว ลองเข้าสู่ระบบแทน",
  "auth/weak-password": "รหัสผ่านสั้นเกินไป ต้องมีอย่างน้อย 8 ตัวอักษร",
  "auth/too-many-requests": "ลองหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่",
  "auth/network-request-failed": "เชื่อมต่ออินเทอร์เน็ตไม่สำเร็จ กรุณาลองใหม่",
  "auth/user-disabled": "บัญชีนี้ถูกระงับการใช้งาน",
  "auth/requires-recent-login": "กรุณาออกจากระบบแล้วเข้าสู่ระบบใหม่ก่อนทำรายการนี้",
  // ข้อผิดพลาดจากการตั้งค่าโปรเจกต์ (ผู้พัฒนาต้องแก้ใน Firebase Console หรือ .env)
  "auth/operation-not-allowed": "ระบบยังไม่เปิดการสมัครด้วยอีเมล (เปิด Email/Password ที่ Firebase Console > Authentication > Sign-in method)",
  "auth/configuration-not-found": "โปรเจกต์ยังไม่ได้เปิดใช้ Authentication (Firebase Console > Authentication > Get started)",
  "auth/invalid-api-key": "ค่า VITE_FIREBASE_API_KEY ใน .env ไม่ถูกต้อง",
  "auth/api-key-not-valid.-please-pass-a-valid-api-key.": "ค่า VITE_FIREBASE_API_KEY ใน .env ไม่ถูกต้อง",
  "auth/unauthorized-domain": "โดเมนนี้ยังไม่ได้รับอนุญาต (เพิ่มที่ Authentication > Settings > Authorized domains)",
  PERMISSION_DENIED: "สมัครสำเร็จ แต่บันทึกข้อมูลผู้ใช้ไม่ได้ (ตรวจ Rules ของ Realtime Database)",
};

export function authErrorMessage(error) {
  return AUTH_ERRORS[error?.code] ?? `เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง (${error?.code ?? error?.message ?? "unknown"})`;
}
