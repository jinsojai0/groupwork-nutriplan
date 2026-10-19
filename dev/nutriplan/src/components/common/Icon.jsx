import { assetUrl } from "../../utils/assetUrl";

/**
 * ไอคอน SVG จากโฟลเดอร์ public (icons/ui, icons/status, icons/categories, branding)
 * ใช้ CSS mask เพื่อให้ไอคอนเปลี่ยนสีตามสีตัวอักษร (currentColor)
 */
export default function Icon({ src, size = 20, className = "", label }) {
  const url = `url("${assetUrl(src)}")`;
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        width: size,
        height: size,
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
