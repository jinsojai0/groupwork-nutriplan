// แบบสอบถามความพึงพอใจ : คำถาม เกณฑ์แปลผล และการคำนวณสถิติ (ไม่เกี่ยวกับ React และ Firebase)

/** มาตราส่วนประมาณค่า 5 ระดับ (Likert scale) */
export const SCALE = [
  { value: 5, label: "มากที่สุด" },
  { value: 4, label: "มาก" },
  { value: 3, label: "ปานกลาง" },
  { value: 2, label: "น้อย" },
  { value: 1, label: "น้อยที่สุด" },
];

export const SURVEY_SECTIONS = [
  {
    id: "usability",
    title: "ด้านการใช้งาน",
    questions: [
      { id: "q01", text: "ระบบใช้งานง่าย เข้าใจได้โดยไม่ต้องมีคำแนะนำ" },
      { id: "q02", text: "เมนูนำทางและการค้นหาช่วยให้หาเมนูอาหารที่ต้องการได้รวดเร็ว" },
      { id: "q03", text: "หน้าจอแสดงผลเหมาะสมทั้งบนคอมพิวเตอร์และมือถือ" },
    ],
  },
  {
    id: "content",
    title: "ด้านเนื้อหาและข้อมูล",
    questions: [
      { id: "q04", text: "ข้อมูลโภชนาการของเมนูอ่านเข้าใจง่ายและน่าเชื่อถือ" },
      { id: "q05", text: "คำเตือนและบทความช่วยให้เข้าใจผลของอาหารต่อสุขภาพมากขึ้น" },
      { id: "q06", text: "การคำนวณเป้าหมายพลังงานแสดงที่มาของตัวเลขได้ชัดเจน" },
    ],
  },
  {
    id: "benefit",
    title: "ด้านประโยชน์ที่ได้รับ",
    questions: [
      { id: "q07", text: "การบันทึกมื้ออาหารช่วยให้ติดตามพลังงานและโซเดียมของแต่ละวันได้" },
      { id: "q08", text: "แผนมื้ออาหารที่ระบบเสนอนำไปใช้ได้จริงภายในงบประมาณ" },
      { id: "q09", text: "ระบบช่วยให้ตัดสินใจเลือกเมนูได้ดีขึ้นก่อนสั่งอาหาร" },
    ],
  },
  {
    id: "overall",
    title: "ภาพรวม",
    questions: [{ id: "q10", text: "ความพึงพอใจโดยรวมต่อระบบ NutriPlan" }],
  },
];

export const QUESTIONS = SURVEY_SECTIONS.flatMap((s) => s.questions.map((q) => ({ ...q, section: s.id })));
export const QUESTION_IDS = QUESTIONS.map((q) => q.id);
export const COMMENT_MAX = 500;

/** เกณฑ์แปลความหมายค่าเฉลี่ย (ช่วงกว้าง 0.80 ตามแนวทางของ Best, 1977) */
export function interpretMean(mean) {
  if (mean == null || Number.isNaN(mean)) return "–";
  if (mean >= 4.51) return "มากที่สุด";
  if (mean >= 3.51) return "มาก";
  if (mean >= 2.51) return "ปานกลาง";
  if (mean >= 1.51) return "น้อย";
  return "น้อยที่สุด";
}

/** ค่าเฉลี่ยและส่วนเบี่ยงเบนมาตรฐาน (กลุ่มตัวอย่าง, n − 1) */
export function meanSd(values) {
  const n = values.length;
  if (!n) return { n: 0, mean: null, sd: null };
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const sd = n > 1 ? Math.sqrt(values.reduce((a, v) => a + (v - mean) ** 2, 0) / (n - 1)) : 0;
  return { n, mean, sd };
}

/** ตรวจคำตอบก่อนบันทึก */
export function validateSurvey(answers, comment) {
  const errors = {};
  for (const id of QUESTION_IDS) {
    const v = answers[id];
    if (!(Number.isInteger(v) && v >= 1 && v <= 5)) errors[id] = "กรุณาเลือกระดับความพึงพอใจ";
  }
  if ((comment ?? "").length > COMMENT_MAX) errors.comment = `ข้อเสนอแนะต้องไม่เกิน ${COMMENT_MAX} ตัวอักษร`;
  return errors;
}

/**
 * สรุปผลแบบสอบถามทั้งหมด
 * @param responses [{ answers: {q01..q10}, comment, submitted_at }]
 */
export function summarize(responses) {
  const perQuestion = QUESTIONS.map((q) => {
    const values = responses.map((r) => r.answers?.[q.id]).filter((v) => Number.isInteger(v));
    const dist = [1, 2, 3, 4, 5].map((s) => values.filter((v) => v === s).length);
    return { ...q, ...meanSd(values), dist };
  });
  const perSection = SURVEY_SECTIONS.map((s) => {
    const ids = s.questions.map((q) => q.id);
    const values = responses.flatMap((r) => ids.map((id) => r.answers?.[id]).filter((v) => Number.isInteger(v)));
    return { id: s.id, title: s.title, ...meanSd(values) };
  });
  const all = responses.flatMap((r) => QUESTION_IDS.map((id) => r.answers?.[id]).filter((v) => Number.isInteger(v)));
  const comments = responses
    .filter((r) => r.comment && r.comment.trim())
    .map((r) => ({ text: r.comment.trim(), at: r.updated_at ?? r.submitted_at }))
    .sort((a, b) => (b.at ?? "").localeCompare(a.at ?? ""));
  return { n: responses.length, overall: meanSd(all), perQuestion, perSection, comments };
}

/** แปลงคำตอบเป็น CSV (ไม่มีข้อมูลระบุตัวตน) สำหรับนำไปวิเคราะห์ต่อ */
export function toCsv(responses) {
  const head = ["no", ...QUESTION_IDS, "comment", "submitted_at"];
  const esc = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
  const rows = responses.map((r, i) =>
    [i + 1, ...QUESTION_IDS.map((id) => r.answers?.[id] ?? ""), esc(r.comment), r.updated_at ?? r.submitted_at ?? ""].join(","),
  );
  return "﻿" + [head.join(","), ...rows].join("\n");
}
