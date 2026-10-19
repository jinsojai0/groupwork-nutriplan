const COLORS = {
  ok: "bg-green-600",
  warn: "bg-amber-500",
  bad: "bg-red-600",
  neutral: "bg-brand-500",
};

/** แถบความคืบหน้า value/max โดยสีบอกระดับ ok, warn, bad หรือ neutral */
export default function ProgressBar({ value, max, level = "neutral", label }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={Math.round(max)}
      aria-valuenow={Math.round(value)}
    >
      <div className={`h-full rounded-full transition-all ${COLORS[level]}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
