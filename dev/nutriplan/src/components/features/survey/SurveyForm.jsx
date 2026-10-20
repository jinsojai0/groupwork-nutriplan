import { useState } from "react";
import { COMMENT_MAX, QUESTION_IDS, SCALE, SURVEY_SECTIONS, validateSurvey } from "../../../utils/survey";
import Button from "../../common/Button";

/** แบบสอบถามความพึงพอใจ 10 ข้อ (มาตราส่วน 5 ระดับ) และข้อเสนอแนะ */
export default function SurveyForm({ initial, onSubmit }) {
  const [answers, setAnswers] = useState(() => ({ ...(initial?.answers ?? {}) }));
  const [comment, setComment] = useState(initial?.comment ?? "");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const choose = (id, value) => {
    setAnswers((a) => ({ ...a, [id]: value }));
    setErrors((e) => ({ ...e, [id]: undefined }));
    setMessage(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = validateSurvey(answers, comment);
    setErrors(er);
    if (Object.keys(er).length) {
      setMessage({ type: "error", text: `กรุณาตอบให้ครบทุกข้อ (ยังไม่ได้ตอบ ${Object.keys(er).filter((k) => k !== "comment").length} ข้อ)` });
      const first = document.getElementById(`q-${Object.keys(er)[0]}`);
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await onSubmit({ answers, comment });
      setMessage({ type: "ok", text: "ขอบคุณที่ตอบแบบสอบถาม บันทึกคำตอบแล้ว" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      {SURVEY_SECTIONS.map((section) => (
        <section key={section.id} className="card overflow-hidden">
          <h2 className="border-b border-slate-100 bg-slate-50 px-4 py-3 font-semibold">{section.title}</h2>
          <div className="divide-y divide-slate-100">
            {section.questions.map((q) => {
              const no = QUESTION_IDS.indexOf(q.id) + 1;
              const err = errors[q.id];
              return (
                <fieldset key={q.id} id={`q-${q.id}`} className={`px-4 py-4 ${err ? "bg-red-50" : ""}`}>
                  <legend className="float-left mb-3 w-full">
                    <span className="mr-1 font-semibold text-brand-700">{no}.</span>
                    {q.text}
                  </legend>
                  <div className="clear-both grid grid-cols-5 gap-1.5 sm:gap-2" role="radiogroup" aria-label={q.text}>
                    {SCALE.map((s) => {
                      const on = answers[q.id] === s.value;
                      return (
                        <label
                          key={s.value}
                          className={`flex cursor-pointer flex-col items-center gap-0.5 rounded-lg border px-1 py-2 text-center transition ${
                            on ? "border-brand-700 bg-brand-700 text-white" : "border-slate-300 bg-white hover:border-brand-500"
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            value={s.value}
                            checked={on}
                            onChange={() => choose(q.id, s.value)}
                            className="sr-only"
                          />
                          <span className="text-lg leading-none font-bold">{s.value}</span>
                          <span className={`text-[11px] leading-tight sm:text-xs ${on ? "text-white" : "text-slate-500"}`}>{s.label}</span>
                        </label>
                      );
                    })}
                  </div>
                  {err && <p className="field-error">{err}</p>}
                </fieldset>
              );
            })}
          </div>
        </section>
      ))}

      <section className="card p-4">
        <label htmlFor="survey-comment" className="font-semibold">
          ข้อเสนอแนะเพิ่มเติม <span className="font-normal text-slate-500">(ไม่บังคับ)</span>
        </label>
        <textarea
          id="survey-comment"
          rows={4}
          maxLength={COMMENT_MAX}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="เช่น เมนูที่อยากให้เพิ่ม หรือส่วนที่ใช้งานยาก"
          className="input mt-2"
        />
        <div className="mt-1 text-right text-xs text-slate-400">
          {comment.length}/{COMMENT_MAX}
        </div>
        {errors.comment && <p className="field-error">{errors.comment}</p>}
      </section>

      {message && (
        <p
          role={message.type === "error" ? "alert" : "status"}
          className={`rounded-lg border p-3 text-sm ${message.type === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-800"}`}
        >
          {message.text}
        </p>
      )}
      <Button type="submit" block disabled={saving}>
        {saving ? "กำลังบันทึก…" : initial ? "บันทึกคำตอบที่แก้ไข" : "ส่งแบบสอบถาม"}
      </Button>
    </form>
  );
}
