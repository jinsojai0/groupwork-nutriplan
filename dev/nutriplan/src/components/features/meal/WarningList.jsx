import { Link } from "react-router-dom";
import Icon from "../../common/Icon";

/** คำเตือนพร้อมลิงก์บทความ (รับรายการที่คำนวณแล้วจาก utils/nutrition) */
export default function WarningList({ warnings, emptyText = "สารอาหารอยู่ในเกณฑ์ ยังไม่มีคำเตือน" }) {
  if (!warnings.length) {
    return (
      <div className="card flex items-center gap-2 border-green-200 bg-green-50 p-3 text-sm text-green-800">
        <Icon src="icons/status/icon_status_ok.svg" size={18} />
        {emptyText}
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {warnings.map((w) => {
        const bad = w.level === "bad";
        return (
          <li
            key={w.key}
            className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 text-sm ${
              bad ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            <span className="flex items-start gap-2">
              <Icon
                src={bad ? "icons/status/icon_status_over.svg" : "icons/status/icon_status_warning.svg"}
                size={18}
                className="mt-0.5"
                label={bad ? "เกินเกณฑ์" : "ควรระวัง"}
              />
              {w.text}
            </span>
            {w.articleId && (
              <Link to={`/articles/${w.articleId}`} className="chip shrink-0 text-xs">
                อ่านเพิ่ม ›
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
