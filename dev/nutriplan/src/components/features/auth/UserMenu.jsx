import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { logout } from "../../../services/authService";
import Icon from "../../common/Icon";

/** ปุ่มผู้ใช้บน Header พร้อมเมนูย่อย */
export default function UserMenu() {
  const { user, isEditor, role } = useAuth();
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false);
    };
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const items = [
    { to: "/profile", label: "โปรไฟล์และเป้าหมาย" },
    { to: "/today", label: "บันทึกวันนี้" },
    { to: "/weekly", label: "สรุปรายสัปดาห์" },
    { to: "/favorites", label: "เมนูโปรด" },
    ...(isEditor ? [{ to: "/admin/menus", label: "จัดการเมนู" }] : []),
  ];
  const name = user.displayName || user.email?.split("@")[0] || "ผู้ใช้";

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <div className="relative" ref={boxRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex max-w-48 items-center gap-2 rounded-full border border-slate-300 bg-white py-1 pr-3 pl-1 text-sm hover:border-brand-500"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <Icon src="icons/ui/icon_ui_user.svg" size={16} />
        </span>
        <span className="truncate">{name}</span>
        {isEditor && <span className="hidden rounded bg-amber-100 px-1.5 text-xs text-amber-800 sm:inline">{role}</span>}
      </button>
      {open && (
        <div role="menu" className="card absolute right-0 mt-2 w-56 overflow-hidden py-1 shadow-lg">
          <div className="border-b border-slate-100 px-4 py-2 text-xs text-slate-500">{user.email}</div>
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-slate-50"
            >
              {it.label}
            </Link>
          ))}
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="block w-full border-t border-slate-100 px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50"
          >
            ออกจากระบบ
          </button>
        </div>
      )}
    </div>
  );
}
