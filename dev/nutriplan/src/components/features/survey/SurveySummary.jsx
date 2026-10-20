import { interpretMean } from "../../../utils/survey";

const f2 = (n) => (n == null ? "–" : n.toFixed(2));

/** แถบแสดงค่าเฉลี่ยบนมาตรา 1–5 */
function MeanBar({ mean }) {
  const pct = mean == null ? 0 : (mean / 5) * 100;
  return (
    <div className="h-2 w-full min-w-16 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
      <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

/** สรุปผลแบบสอบถาม : จำนวนผู้ตอบ ค่าเฉลี่ย ส่วนเบี่ยงเบนมาตรฐาน ระดับความพึงพอใจ และข้อเสนอแนะ */
export default function SurveySummary({ summary }) {
  const { n, overall, perQuestion, perSection, comments } = summary;
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <div className="text-sm text-slate-500">จำนวนผู้ตอบ</div>
          <div className="text-3xl font-bold tabular-nums">{n}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-500">ค่าเฉลี่ยรวม (เต็ม 5)</div>
          <div className="text-3xl font-bold tabular-nums">{f2(overall.mean)}</div>
          <div className="text-sm text-slate-500">S.D. {f2(overall.sd)}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-500">ระดับความพึงพอใจโดยรวม</div>
          <div className="text-3xl font-bold text-brand-700">{interpretMean(overall.mean)}</div>
        </div>
      </div>

      <section className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-50 text-left text-xs text-slate-500">
            <tr>
              <th className="px-3 py-2">ข้อ</th>
              <th className="px-3 py-2">รายการประเมิน</th>
              <th className="px-3 py-2 text-right">x̄</th>
              <th className="px-3 py-2 text-right">S.D.</th>
              <th className="px-3 py-2">ระดับ</th>
              <th className="w-28 px-3 py-2" />
              <th className="px-3 py-2 text-right" title="จำนวนผู้ตอบระดับ 5 / 4 / 3 / 2 / 1">5/4/3/2/1</th>
            </tr>
          </thead>
          <tbody>
            {perSection.map((s) => (
              <SectionRows key={s.id} section={s} rows={perQuestion.filter((q) => q.section === s.id)} />
            ))}
            <tr className="border-t-2 border-slate-300 font-semibold">
              <td className="px-3 py-2" colSpan={2}>รวมทุกข้อ</td>
              <td className="px-3 py-2 text-right tabular-nums">{f2(overall.mean)}</td>
              <td className="px-3 py-2 text-right tabular-nums">{f2(overall.sd)}</td>
              <td className="px-3 py-2">{interpretMean(overall.mean)}</td>
              <td className="px-3 py-2"><MeanBar mean={overall.mean} /></td>
              <td />
            </tr>
          </tbody>
        </table>
        <p className="border-t border-slate-100 px-3 py-2 text-xs text-slate-500">
          เกณฑ์แปลผล : 4.51–5.00 มากที่สุด · 3.51–4.50 มาก · 2.51–3.50 ปานกลาง · 1.51–2.50 น้อย · 1.00–1.50 น้อยที่สุด
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">ข้อเสนอแนะ ({comments.length})</h2>
        {comments.length ? (
          <ul className="space-y-2">
            {comments.map((c, i) => (
              <li key={i} className="card p-3 text-sm">
                <p className="whitespace-pre-line">{c.text}</p>
                {c.at && <p className="mt-1 text-xs text-slate-400">{new Date(c.at).toLocaleDateString("th-TH", { dateStyle: "medium" })}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">ยังไม่มีข้อเสนอแนะ</p>
        )}
      </section>
    </div>
  );
}

function SectionRows({ section, rows }) {
  return (
    <>
      <tr className="border-t border-slate-200 bg-slate-50/60 font-semibold">
        <td className="px-3 py-2" colSpan={2}>{section.title}</td>
        <td className="px-3 py-2 text-right tabular-nums">{f2(section.mean)}</td>
        <td className="px-3 py-2 text-right tabular-nums">{f2(section.sd)}</td>
        <td className="px-3 py-2">{interpretMean(section.mean)}</td>
        <td className="px-3 py-2"><MeanBar mean={section.mean} /></td>
        <td />
      </tr>
      {rows.map((q) => (
        <tr key={q.id} className="border-t border-slate-100">
          <td className="px-3 py-2 text-slate-500">{Number(q.id.slice(1))}</td>
          <td className="px-3 py-2">{q.text}</td>
          <td className="px-3 py-2 text-right tabular-nums">{f2(q.mean)}</td>
          <td className="px-3 py-2 text-right tabular-nums">{f2(q.sd)}</td>
          <td className="px-3 py-2">{interpretMean(q.mean)}</td>
          <td className="px-3 py-2"><MeanBar mean={q.mean} /></td>
          <td className="px-3 py-2 text-right text-xs whitespace-nowrap text-slate-500 tabular-nums">{[...q.dist].reverse().join(" / ")}</td>
        </tr>
      ))}
    </>
  );
}
