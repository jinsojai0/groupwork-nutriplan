import { Link } from "react-router-dom";

const VARIANTS = {
  primary: "bg-brand-700 text-white border-brand-700 hover:bg-brand-800",
  ghost: "bg-white text-brand-700 border-brand-300 hover:bg-brand-50",
  danger: "bg-red-700 text-white border-red-700 hover:bg-red-800",
  "danger-ghost": "bg-white text-red-700 border-red-300 hover:bg-red-50",
};
const SIZES = {
  sm: "min-h-8 px-3 py-1 text-sm",
  md: "min-h-10 px-4 py-2",
};

/** ปุ่มมาตรฐาน : ถ้าส่ง to จะเป็นลิงก์ของ React Router */
export default function Button({ to, variant = "primary", size = "md", block = false, className = "", children, ...rest }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${block ? "w-full" : ""} ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
