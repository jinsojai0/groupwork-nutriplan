// ทดสอบการนำเข้า JSON และ Security Rules กับ Firebase Emulator (Realtime Database + Authentication)
//
// วิธีใช้ (ต้องติดตั้ง Node.js 18+, Java 11+ และ Firebase CLI ก่อน)
//   1) cd firebase
//   2) firebase emulators:start --only database,auth --project demo-nutriplan
//   3) เปิดอีกหน้าต่างหนึ่ง แล้วรัน   node test-rules.mjs
//
// สคริปต์นี้ไม่ต้องติดตั้งแพ็กเกจเพิ่ม ใช้ fetch ที่มีใน Node.js 18 ขึ้นไป
import { readFile } from "node:fs/promises";

const PROJECT = "demo-nutriplan";
const DB = `http://127.0.0.1:9000`;
const NS = `ns=${PROJECT}-default-rtdb`;
const AUTH = `http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1`;
const OWNER = { Authorization: "Bearer owner" };           // สิทธิ์ผู้ดูแล (ข้าม Security Rules)
const today = "2026-09-20";

const url = (path, token) => `${DB}/${path}.json?${NS}${token ? `&auth=${token}` : ""}`;
const req = async (method, path, { body, token, headers } = {}) => {
  const res = await fetch(url(path, token), {
    method,
    headers: { "Content-Type": "application/json", ...(headers || {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: res.status, data: await res.json().catch(() => null) };
};
const signUp = async (email) => {
  const res = await fetch(`${AUTH}/accounts:signUp?key=demo-api-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "demo-pass-123", returnSecureToken: true }),
  });
  const j = await res.json();
  return { uid: j.localId, token: j.idToken };
};

const results = [];
const expect = (name, ok, detail = "") => {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`);
};

// ---------------------------------------------------------------- 1) นำเข้า JSON
const seed = JSON.parse(await readFile(new URL("./nutriplan-firebase.json", import.meta.url), "utf-8"));
let r = await req("PUT", "", { body: seed, headers: OWNER });
expect("นำเข้า nutriplan-firebase.json ทั้งไฟล์สำเร็จ", r.status === 200, `HTTP ${r.status}`);

r = await req("GET", "menus", { headers: OWNER });
const menuCount = r.data ? Object.keys(r.data).length : 0;
expect("จำนวนเมนูในฐานข้อมูลตรงกับไฟล์", menuCount === Object.keys(seed.menus).length,
       `${menuCount} รายการ`);
r = await req("GET", "categories", { headers: OWNER });
expect("จำนวนหมวดหมู่ตรงกับไฟล์", r.data && Object.keys(r.data).length === Object.keys(seed.categories).length);

// ---------------------------------------------------------------- 2) ผู้ใช้ทั่วไป (ไม่เข้าสู่ระบบ)
r = await req("GET", "menus/menu_007");
expect("ผู้ใช้ทั่วไปอ่านข้อมูลเมนูได้", r.status === 200 && r.data?.name_th === seed.menus.menu_007.name_th);
r = await req("PUT", "menus/menu_007/price_thb", { body: 1 });
expect("ผู้ใช้ทั่วไปแก้ไขเมนูไม่ได้", r.status === 401, `HTTP ${r.status}`);
r = await req("GET", "users");
expect("ผู้ใช้ทั่วไปอ่านข้อมูลผู้ใช้ไม่ได้", r.status === 401, `HTTP ${r.status}`);

// ---------------------------------------------------------------- 3) สมาชิก
const a = await signUp(`member-a-${Date.now()}@nutriplan.example`);
const b = await signUp(`member-b-${Date.now()}@nutriplan.example`);
const log = { menu_id: "menu_007", meal_type: "lunch", qty: 1, logged_at: `${today}T12:10:00+07:00` };

r = await req("PUT", `meal_logs/${a.uid}/${today}/log_1`, { body: log, token: a.token });
expect("สมาชิกบันทึกมื้ออาหารของตนเองได้", r.status === 200, `HTTP ${r.status}`);
r = await req("PUT", `meal_logs/${a.uid}/${today}/log_2`, { body: { ...log, meal_type: "brunch" }, token: a.token });
expect("ปฏิเสธประเภทมื้อที่ไม่อยู่ในค่ามาตรฐาน", r.status === 401, `HTTP ${r.status}`);
r = await req("PUT", `meal_logs/${a.uid}/${today}/log_3`, { body: { ...log, menu_id: "menu_999" }, token: a.token });
expect("ปฏิเสธรหัสเมนูที่ไม่มีอยู่จริง", r.status === 401, `HTTP ${r.status}`);
r = await req("PUT", `meal_logs/${a.uid}/20-09-2026/log_4`, { body: log, token: a.token });
expect("ปฏิเสธวันที่ที่ไม่ใช่รูปแบบ YYYY-MM-DD", r.status === 401, `HTTP ${r.status}`);
r = await req("GET", `meal_logs/${b.uid}`, { token: a.token });
expect("สมาชิกอ่านบันทึกของผู้อื่นไม่ได้", r.status === 401, `HTTP ${r.status}`);
r = await req("PUT", `favorites/${a.uid}/menu_007`, { body: true, token: a.token });
expect("สมาชิกเพิ่มเมนูโปรดได้", r.status === 200, `HTTP ${r.status}`);
r = await req("PUT", `users/${a.uid}/profile/weight_kg`, { body: 500, token: a.token });
expect("ปฏิเสธน้ำหนักตัวที่ผิดช่วง", r.status === 401, `HTTP ${r.status}`);
r = await req("PUT", `roles/${a.uid}`, { body: "admin", token: a.token });
expect("สมาชิกยกระดับสิทธิ์ตนเองไม่ได้", r.status === 401, `HTTP ${r.status}`);
r = await req("PUT", "menus/menu_007/price_thb", { body: 60, token: a.token });
expect("สมาชิกแก้ไขข้อมูลเมนูไม่ได้", r.status === 401, `HTTP ${r.status}`);

// ---------------------------------------------------------------- 4) ผู้ดูแลข้อมูล
await req("PUT", `roles/${a.uid}`, { body: "editor", headers: OWNER });
r = await req("PUT", "menus/menu_007/price_thb", { body: 60, token: a.token });
expect("ผู้ดูแลข้อมูลแก้ไขราคาเมนูได้", r.status === 200, `HTTP ${r.status}`);
r = await req("PUT", "menus/menu_007/category_id", { body: "cat_unknown", token: a.token });
expect("ปฏิเสธหมวดหมู่ที่ไม่มีอยู่จริงแม้เป็นผู้ดูแลข้อมูล", r.status === 401, `HTTP ${r.status}`);
await req("PUT", "menus/menu_007/price_thb", { body: seed.menus.menu_007.price_thb, headers: OWNER });

const passed = results.filter((x) => x.ok).length;
console.log(`\nสรุป: ผ่าน ${passed} จาก ${results.length} กรณีทดสอบ`);
process.exit(passed === results.length ? 0 : 1);
