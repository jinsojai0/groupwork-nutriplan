export default function KeyPointList({ points }) {
  return (
    <ol className="space-y-3">
      {points.map((p, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
            {i + 1}
          </span>
          <span className="pt-0.5">{p}</span>
        </li>
      ))}
    </ol>
  );
}
