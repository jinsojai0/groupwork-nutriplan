import { useEffect, useState } from "react";
import StateView from "../components/common/StateView";
import { useLookup } from "../hooks/useLookup";
import { usePageTitle } from "../hooks/usePageTitle";
import { assetUrl } from "../utils/assetUrl";

/** หน้าเครดิตภาพและแหล่งข้อมูล (ภาพเมนูจาก Wikimedia Commons ต้องระบุผู้สร้างและสัญญาอนุญาต) */
export default function CreditsPage() {
  usePageTitle("เครดิตภาพและแหล่งข้อมูล");
  const [credits, setCredits] = useState({ status: "loading", rows: [] });
  const [attempt, setAttempt] = useState(0);
  const sources = useLookup("sources");

  useEffect(() => {
    let cancelled = false;
    fetch(assetUrl("credits/image_credits.json"))
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then((rows) => !cancelled && setCredits({ status: "ok", rows }))
      .catch(() => !cancelled && setCredits({ status: "error", rows: [] }));
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">เครดิตภาพและแหล่งข้อมูล</h1>
        <p className="text-slate-500">
          ภาพเมนูอาหารมาจาก Wikimedia Commons ผู้จัดทำครอปเป็นสัดส่วน 4:3 ย่อขนาด และแปลงเป็น WebP
          ภาพที่ดัดแปลงอยู่ภายใต้สัญญาอนุญาตเดิมของภาพต้นฉบับ
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-xl font-bold">ภาพเมนูอาหาร</h2>
        {credits.status === "ok" ? (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-slate-50 text-left text-xs text-slate-500">
                <tr>
                  <th className="px-3 py-2">เมนู</th>
                  <th className="px-3 py-2">ภาพต้นฉบับ</th>
                  <th className="px-3 py-2">ผู้สร้าง</th>
                  <th className="px-3 py-2">สัญญาอนุญาต</th>
                </tr>
              </thead>
              <tbody>
                {credits.rows.map((c) => (
                  <tr key={c.menu_id} className="border-t border-slate-100 align-top">
                    <td className="px-3 py-2">{c.name_th}</td>
                    <td className="px-3 py-2 break-all">
                      {c.page_url ? (
                        <a href={c.page_url} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">{c.commons_file}</a>
                      ) : (
                        c.commons_file
                      )}
                    </td>
                    <td className="px-3 py-2">{c.author || "–"}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {c.license_url ? (
                        <a href={c.license_url} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">{c.license}</a>
                      ) : (
                        c.license
                      )}
                      {c.license.includes("NC") && <span className="block text-xs text-amber-700">ห้ามใช้เชิงพาณิชย์</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <StateView kind={credits.status} variant="list" onRetry={() => setAttempt((a) => a + 1)} />
        )}
      </section>

      <section>
        <h2 className="mb-2 text-xl font-bold">ภาพอื่น ๆ และฟอนต์</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>ภาพปกบทความ 12 ภาพ : ภาพประกอบที่สร้างด้วย AI สำหรับโครงงานนี้ ไม่ใช่ภาพถ่ายอาหารจริง</li>
          <li>โลโก้ ไอคอน และภาพประกอบสถานะ : ออกแบบโดยผู้จัดทำ</li>
          <li>ฟอนต์ Sarabun : Google Fonts สัญญาอนุญาต SIL Open Font License 1.1</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-bold">แหล่งข้อมูลโภชนาการและเนื้อหา</h2>
        <ul className="space-y-2 text-sm text-slate-600">
          {sources.list.map((s) => (
            <li key={s.id}>
              <span className="font-mono text-xs text-slate-400">{s.id}</span>{" "}
              {s.url_reference?.startsWith("http") ? (
                <a href={s.url_reference} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">{s.name}</a>
              ) : (
                s.name
              )}
              {s.owner_license && <span className="text-slate-400"> · {s.owner_license}</span>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
