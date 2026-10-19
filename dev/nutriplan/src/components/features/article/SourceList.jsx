/** รายการแหล่งอ้างอิงจาก sources */
export default function SourceList({ sourceIds, sources }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">
      {sourceIds.map((id) => {
        const s = sources[id];
        if (!s) return <li key={id}>{id}</li>;
        return (
          <li key={id}>
            {s.url_reference?.startsWith("http") ? (
              <a href={s.url_reference} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">
                {s.name}
              </a>
            ) : (
              s.name
            )}
            {s.owner_license && <span className="text-slate-400"> · {s.owner_license}</span>}
          </li>
        );
      })}
    </ul>
  );
}
