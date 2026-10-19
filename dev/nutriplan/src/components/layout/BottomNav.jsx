import { NavLink } from "react-router-dom";
import Icon from "../common/Icon";

const ITEMS = [
  { to: "/", label: "หน้าแรก", icon: "branding/logo_mark.svg", end: true },
  { to: "/search", label: "ค้นหา", icon: "icons/ui/icon_ui_search.svg" },
  { to: "/today", label: "วันนี้", icon: "icons/ui/icon_ui_calendar.svg" },
  { to: "/planner", label: "วางแผน", icon: "icons/ui/icon_ui_wallet.svg" },
  { to: "/articles", label: "บทความ", icon: "icons/ui/icon_ui_book.svg" },
];

/** แถบนำทางด้านล่าง แสดงเฉพาะหน้าจอมือถือ */
export default function BottomNav() {
  return (
    <>
      <div className="h-16 lg:hidden" aria-hidden="true" />
      <nav
        aria-label="เมนูหลัก (มือถือ)"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {ITEMS.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 text-xs ${isActive ? "font-semibold text-brand-700" : "text-slate-500"}`
            }
          >
            <Icon src={it.icon} size={22} />
            {it.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
