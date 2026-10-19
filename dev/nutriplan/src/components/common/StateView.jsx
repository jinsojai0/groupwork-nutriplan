import { assetUrl } from "../../utils/assetUrl";
import Button from "./Button";

/**
 * แสดงสถานะของข้อมูล : loading (โครงการ์ดสีเทา), empty (ไม่มีข้อมูล), error (เกิดข้อผิดพลาด)
 * @param variant "cards" | "list" | "block" รูปแบบโครงขณะโหลด
 */
export default function StateView({ kind, message, detail, onRetry, action, variant = "cards", count = 4 }) {
  if (kind === "loading") {
    return (
      <div aria-busy="true" aria-live="polite">
        {variant === "cards" ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="skeleton aspect-[4/3] rounded-none" />
                <div className="space-y-2 p-3">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {Array.from({ length: variant === "block" ? 1 : count }, (_, i) => (
              <div key={i} className={`skeleton ${variant === "block" ? "h-40" : "h-14"}`} />
            ))}
          </div>
        )}
        <p className="mt-3 text-center text-sm text-slate-500">{message ?? "กำลังโหลดข้อมูล…"}</p>
      </div>
    );
  }

  const isError = kind === "error";
  return (
    <div role={isError ? "alert" : "status"} className="card px-4 py-8 text-center">
      <img
        src={assetUrl(isError ? "illustrations/illus_not_found.svg" : "illustrations/illus_no_result.svg")}
        alt=""
        className="mx-auto mb-3 h-28 w-auto"
      />
      <p className="font-semibold text-slate-800">{message ?? (isError ? "โหลดข้อมูลไม่สำเร็จ" : "ไม่พบข้อมูล")}</p>
      <p className="mt-1 text-sm text-slate-500">
        {detail ?? (isError ? "ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต แล้วลองอีกครั้ง" : "ลองเปลี่ยนคำค้นหรือตัวกรอง")}
      </p>
      {(onRetry || action) && (
        <div className="mt-4 flex justify-center gap-2">
          {onRetry && (
            <Button size="sm" onClick={onRetry}>
              ลองอีกครั้ง
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}
