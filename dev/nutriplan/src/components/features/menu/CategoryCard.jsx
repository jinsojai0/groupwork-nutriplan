import { Link } from "react-router-dom";
import Icon from "../../common/Icon";

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/menus?category=${category.id}`}
      className="card flex items-center gap-3 p-3 transition hover:border-brand-300 hover:shadow-sm"
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${category.color}1a`, color: category.color }}
      >
        <Icon src={category.icon} size={24} />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-semibold text-slate-800">{category.name_th}</span>
        <span className="text-sm text-slate-500">{category.menu_count} เมนู</span>
      </span>
    </Link>
  );
}
