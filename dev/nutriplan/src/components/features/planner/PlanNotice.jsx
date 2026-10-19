import { Link } from "react-router-dom";
import Icon from "../../common/Icon";

/** แจ้งผลเมื่อไม่มีแผนที่อยู่ในงบ หรือทุกแผนมีโซเดียมเกินเกณฑ์ */
export default function PlanNotice({ kind }) {
  const content =
    kind === "budget"
      ? {
          title: "ไม่พบแผนที่อยู่ในงบประมาณนี้",
          text: "ลองเพิ่มงบประมาณต่อวัน หรือยกเลิกตัวเลือกมังสวิรัติ/ไม่เผ็ดเพื่อให้มีเมนูให้เลือกมากขึ้น",
          article: "article_11",
        }
      : {
          title: "แผนที่พลังงานใกล้เป้าหมายในงบนี้ยังมีโซเดียมเกิน 2,000 มก.",
          text: "ชุดที่โซเดียมไม่เกินเกณฑ์ให้พลังงานต่ำกว่าเป้าหมายมาก ระบบจึงแสดงชุดที่สมดุลที่สุด ลดโซเดียมได้ด้วยการไม่ซดน้ำซุปจนหมดและขอลดเครื่องปรุง",
          article: "article_03",
        };
  return (
    <div role="status" className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <Icon src="icons/status/icon_status_warning.svg" size={20} className="mt-0.5" />
      <div>
        <p className="font-semibold">{content.title}</p>
        <p className="mt-1">{content.text}</p>
        <Link to={`/articles/${content.article}`} className="mt-2 inline-block font-medium underline">
          อ่านบทความที่เกี่ยวข้อง ›
        </Link>
      </div>
    </div>
  );
}
