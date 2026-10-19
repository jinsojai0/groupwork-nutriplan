import { Link } from "react-router-dom";
import { assetUrl } from "../../utils/assetUrl";

export default function Logo({ white = false }) {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="NutriPlan หน้าแรก">
      <img
        src={assetUrl("branding/logo_mark.svg")}
        alt=""
        className={`h-8 w-8 ${white ? "brightness-0 invert" : ""}`}
      />
      <span className={`text-xl font-bold ${white ? "text-white" : "text-brand-700"}`}>NutriPlan</span>
    </Link>
  );
}
