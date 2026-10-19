import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "หน้าแรก", end: true },
  { to: "/menus", label: "เมนูอาหาร" },
  { to: "/today", label: "บันทึกวันนี้" },
  { to: "/planner", label: "วางแผนมื้ออาหาร" },
  { to: "/articles", label: "บทความ" },
];

/** เมนูนำทางบนเดสก์ท็อป (มือถือใช้ BottomNav) */
export default function NavBar() {
  return (
    <nav aria-label="เมนูหลัก" className="hidden gap-1 lg:flex">
      {NAV_ITEMS.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.end}
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition ${
              isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
            }`
          }
        >
          {it.label}
        </NavLink>
      ))}
    </nav>
  );
}
