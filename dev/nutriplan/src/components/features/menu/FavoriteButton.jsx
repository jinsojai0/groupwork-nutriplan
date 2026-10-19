import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { setFavorite } from "../../../services/favoriteService";

/** เพิ่มหรือลบเมนูโปรด (ต้องเข้าสู่ระบบ) */
export default function FavoriteButton({ menuId, isFavorite }) {
  const { uid } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const toggle = async () => {
    if (!uid) {
      navigate("/login", { state: { from: pathname } });
      return;
    }
    setSaving(true);
    setError("");
    try {
      await setFavorite(uid, menuId, !isFavorite);
    } catch (e) {
      console.error(e);
      setError("บันทึกเมนูโปรดไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        disabled={saving}
        aria-pressed={!!isFavorite}
        className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-4 py-2 font-semibold transition disabled:opacity-60 ${
          isFavorite ? "border-pink-300 bg-pink-50 text-pink-700" : "border-slate-300 bg-white text-slate-700 hover:border-pink-300"
        }`}
      >
        <span aria-hidden="true">{isFavorite ? "♥" : "♡"}</span>
        {isFavorite ? "เมนูโปรด" : "เพิ่มเป็นเมนูโปรด"}
      </button>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
