import { useState } from "react";
import Button from "../components/common/Button";
import SearchBar from "../components/common/SearchBar";
import StateView from "../components/common/StateView";
import MenuTable from "../components/features/admin/MenuTable";
import { useCategories } from "../hooks/useCategories";
import { useMenus } from "../hooks/useMenus";
import { usePageTitle } from "../hooks/usePageTitle";
import { searchMenus } from "../utils/nutrition";

/** P13 จัดการเมนู (ผู้ดูแลข้อมูล) */
export default function AdminMenuListPage() {
  usePageTitle("จัดการเมนู");
  const menus = useMenus();
  const cats = useCategories();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const list = (q ? searchMenus(menus.menus, q).concat(menus.menus.filter((m) => m.id.includes(q.toLowerCase()))) : menus.menus)
    .filter((m, i, arr) => arr.indexOf(m) === i)
    .filter((m) => !status || m.verification_status === status);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">จัดการเมนูอาหาร</h1>
          <p className="text-sm text-slate-500">ทั้งหมด {menus.menus.length} เมนู</p>
        </div>
        <Button to="/admin/menus/new">+ เพิ่มเมนู</Button>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchBar onSearch={setQ} placeholder="ค้นหาชื่อเมนูหรือรหัส เช่น menu_007" />
        </div>
        <select className="input sm:w-48" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="กรองตามสถานะ">
          <option value="">ทุกสถานะ</option>
          <option value="VERIFIED">VERIFIED</option>
          <option value="PENDING">PENDING</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>
      {menus.status === "error" ? (
        <StateView kind="error" onRetry={menus.retry} />
      ) : menus.status === "loading" ? (
        <StateView kind="loading" variant="list" count={6} />
      ) : list.length === 0 ? (
        <StateView kind="empty" message="ไม่พบเมนูที่ตรงเงื่อนไข" />
      ) : (
        <MenuTable menus={list} categoriesById={cats.byId} />
      )}
    </div>
  );
}
