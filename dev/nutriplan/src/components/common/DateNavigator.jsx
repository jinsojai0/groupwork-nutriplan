import { addDays, thaiDate, todayKey } from "../../utils/format";

/** เลื่อนวันที่ทีละวัน ไม่ให้เลือกวันในอนาคต */
export default function DateNavigator({ date, onChange }) {
  const today = todayKey();
  const isToday = date === today;
  const btn = "flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-lg hover:bg-slate-50 disabled:opacity-40";
  return (
    <div className="card flex items-center justify-between gap-2 p-2">
      <button type="button" className={btn} onClick={() => onChange(addDays(date, -1))} aria-label="วันก่อนหน้า">
        ‹
      </button>
      <div className="text-center">
        <div className="font-semibold">{isToday ? "วันนี้" : thaiDate(date)}</div>
        {isToday ? (
          <div className="text-sm text-slate-500">{thaiDate(date)}</div>
        ) : (
          <button type="button" className="text-sm text-brand-700 underline" onClick={() => onChange(today)}>
            กลับไปวันนี้
          </button>
        )}
      </div>
      <button type="button" className={btn} onClick={() => onChange(addDays(date, 1))} disabled={isToday} aria-label="วันถัดไป">
        ›
      </button>
    </div>
  );
}
