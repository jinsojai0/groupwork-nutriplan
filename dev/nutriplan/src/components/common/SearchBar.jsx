import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";

/** รับคำค้น : ค่าเริ่มต้นไปที่หน้าผลการค้นหา /search?q= หรือส่ง onSearch เพื่อใช้กับหน้าอื่น */
export default function SearchBar({ defaultValue = "", onSearch, compact = false, placeholder = "ค้นหาเมนู เช่น กะเพรา ก๋วยเตี๋ยว" }) {
  const [keyword, setKeyword] = useState(defaultValue);
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    if (onSearch) onSearch(q);
    else navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <form role="search" onSubmit={submit} className="flex w-full gap-2">
      <label className="relative flex-1">
        <span className="sr-only">ค้นหาเมนู</span>
        <Icon src="icons/ui/icon_ui_search.svg" size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={placeholder}
          className={`input pl-9 ${compact ? "py-1.5 text-sm" : ""}`}
        />
      </label>
      {!compact && (
        <button type="submit" className="rounded-lg bg-brand-700 px-4 font-semibold text-white hover:bg-brand-800">
          ค้นหา
        </button>
      )}
    </form>
  );
}
