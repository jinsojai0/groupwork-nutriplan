import { Link } from "react-router-dom";
import { useLookup } from "../../hooks/useLookup";
import Logo from "../common/Logo";

export default function Footer() {
  const { map: meta } = useLookup("meta");
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm text-slate-600 md:grid-cols-[2fr_1fr_1fr] md:px-6">
        <div className="space-y-2">
          <Logo />
          <p>ระบบให้ความรู้ด้านโภชนาการและวางแผนมื้ออาหารสำหรับอาหารจานเดียวและอาหารตามสั่งของไทย</p>
          {meta.disclaimer_th && <p className="text-slate-500">{meta.disclaimer_th}</p>}
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-slate-800">ข้อมูลอ้างอิง</p>
          <p>ฐานข้อมูลองค์ประกอบอาหารไทย (Thai FCD)</p>
          <p>แนวทาง WHO เรื่องโซเดียมและน้ำตาล</p>
          <Link to="/articles" className="block text-brand-700 hover:underline">บทความให้ความรู้</Link>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-slate-800">เกี่ยวกับ</p>
          <p>รายวิชา CSD3202</p>
          {meta.data_updated_at && <p>ปรับปรุงข้อมูล {meta.data_updated_at}</p>}
          <Link to="/credits" className="block text-brand-700 hover:underline">เครดิตภาพและแหล่งข้อมูล</Link>
        </div>
      </div>
    </footer>
  );
}
