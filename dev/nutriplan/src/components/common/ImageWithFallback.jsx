import { useState } from "react";
import { assetUrl } from "../../utils/assetUrl";

/** แสดงภาพจาก public ถ้าโหลดไม่ได้ (เช่น เมนูใหม่ที่ยังไม่มีภาพ) จะแสดงกรอบแทนภาพ */
export default function ImageWithFallback({ src, alt, className = "", eager = false }) {
  const [failedSrc, setFailedSrc] = useState(null);
  if (!src || failedSrc === src) {
    return (
      <div role="img" aria-label={alt} className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}>
        <img src={assetUrl("branding/logo_mark.svg")} alt="" className="h-10 w-10 opacity-30" />
      </div>
    );
  }
  return (
    <img
      src={assetUrl(src)}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={`bg-slate-100 object-cover ${className}`}
    />
  );
}
