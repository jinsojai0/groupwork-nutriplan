// ฟังก์ชันจัดรูปแบบตัวเลขและวันที่ (ไม่เกี่ยวกับ React และ Firebase)

/** ตัวเลขทศนิยมไม่เกิน 1 ตำแหน่ง พร้อมจุลภาค เช่น 1,985 หรือ 56.7 */
export const fmt = (n) =>
  (Math.round((Number(n) || 0) * 10) / 10).toLocaleString("th-TH");

const pad = (n) => String(n).padStart(2, "0");

/** วันที่ตามเวลาเครื่องในรูปแบบ Key ของฐานข้อมูล YYYY-MM-DD */
export function dateKey(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export const todayKey = () => dateKey(new Date());

export function parseDateKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isValidDateKey(key) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key ?? "")) return false;
  return dateKey(parseDateKey(key)) === key;
}

export function addDays(key, n) {
  const d = parseDateKey(key);
  d.setDate(d.getDate() + n);
  return dateKey(d);
}

/** 20 กันยายน 2569 */
export const thaiDate = (key) =>
  parseDateKey(key).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });

/** 20 ก.ย. */
export const thaiShortDate = (key) =>
  parseDateKey(key).toLocaleDateString("th-TH", { day: "numeric", month: "short" });

/** จ. อ. พ. ... */
export const thaiWeekday = (key) =>
  parseDateKey(key).toLocaleDateString("th-TH", { weekday: "short" });

/** ปีปัจจุบันแบบ พ.ศ. */
export const currentBuddhistYear = (now = new Date()) => now.getFullYear() + 543;

/** หัวข้อบทความ (articles.topic) */
export const TOPIC_TH = {
  basic: "พื้นฐาน",
  sodium: "โซเดียม",
  sugar: "น้ำตาล",
  protein: "โปรตีน",
  fiber: "ใยอาหาร",
  fat: "ไขมัน",
  practice: "การนำไปใช้",
};

/** การเรียงลำดับในหน้ารายการเมนู */
export const SORT_OPTIONS = [
  { id: "sodium", label: "โซเดียมน้อย → มาก", field: "sodium_mg" },
  { id: "kcal", label: "พลังงานน้อย → มาก", field: "energy_kcal" },
  { id: "price", label: "ราคาถูก → แพง", field: "price_thb" },
];
