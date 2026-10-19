import { Link } from "react-router-dom";
import { fmt } from "../../../utils/format";
import { checkEnergy } from "../../../utils/nutrition";

const STATUS_CLS = {
  VERIFIED: "border-green-200 bg-green-50 text-green-800",
  PENDING: "border-amber-200 bg-amber-50 text-amber-800",
  REJECTED: "border-red-200 bg-red-50 text-red-800",
};

/** ตารางเมนูและสถานะการสอบทาน สำหรับผู้ดูแลข้อมูล */
export default function MenuTable({ menus, categoriesById }) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-slate-50 text-left text-xs text-slate-500">
          <tr>
            <th className="px-3 py-2">รหัส</th>
            <th className="px-3 py-2">ชื่อเมนู</th>
            <th className="px-3 py-2">หมวด</th>
            <th className="px-3 py-2 text-right">kcal</th>
            <th className="px-3 py-2 text-right">โซเดียม</th>
            <th className="px-3 py-2 text-right">ราคา</th>
            <th className="px-3 py-2">สถานะ</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {menus.map((m) => {
            const energy = checkEnergy(m);
            return (
              <tr key={m.id} className="border-t border-slate-100">
                <td className="px-3 py-2 font-mono text-xs">{m.id}</td>
                <td className="px-3 py-2">
                  <Link to={`/menus/${m.id}`} className="hover:text-brand-700 hover:underline">{m.name_th}</Link>
                  {!energy.ok && (
                    <span className="ml-2 text-xs text-amber-700" title="พลังงานต่างจาก 4P+9F+4C เกิน 8%">⚠ ตรวจพลังงาน</span>
                  )}
                </td>
                <td className="px-3 py-2">{categoriesById[m.category_id]?.name_th ?? m.category_id}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmt(m.energy_kcal)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmt(m.sodium_mg)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{m.price_thb}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full border px-2 py-0.5 text-xs ${STATUS_CLS[m.verification_status] ?? ""}`}>
                    {m.verification_status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <Link to={`/admin/menus/${m.id}/edit`} className="chip text-xs">แก้ไข</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
