import { Fragment } from "react";
import { Link } from "react-router-dom";

/** items : [{ to, label }] รายการสุดท้ายไม่มี to */
export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="breadcrumb" className="mb-3 text-sm text-slate-500">
      {items.map((it, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="mx-1.5">›</span>}
          {it.to ? (
            <Link to={it.to} className="hover:text-brand-700 hover:underline">
              {it.label}
            </Link>
          ) : (
            <span className="text-slate-700" aria-current="page">{it.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
