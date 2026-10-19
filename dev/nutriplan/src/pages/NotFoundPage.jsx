import Button from "../components/common/Button";
import { usePageTitle } from "../hooks/usePageTitle";
import { assetUrl } from "../utils/assetUrl";

/** P15 ไม่พบหน้า */
export default function NotFoundPage({ message = "ไม่พบหน้าที่ต้องการ", detail = "ลิงก์อาจไม่ถูกต้อง หรือหน้านี้ถูกย้ายไปแล้ว" }) {
  usePageTitle("ไม่พบหน้า");
  return (
    <div className="py-10 text-center">
      <img src={assetUrl("illustrations/illus_not_found.svg")} alt="" className="mx-auto mb-4 h-40 w-auto" />
      <h1 className="text-2xl font-bold">{message}</h1>
      <p className="mt-1 text-slate-500">{detail}</p>
      <div className="mt-5 flex justify-center gap-2">
        <Button to="/">กลับหน้าแรก</Button>
        <Button to="/menus" variant="ghost">ดูเมนูทั้งหมด</Button>
      </div>
    </div>
  );
}
