import { useParams } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";
import ImageWithFallback from "../components/common/ImageWithFallback";
import StateView from "../components/common/StateView";
import AddMealButton from "../components/features/meal/AddMealButton";
import WarningList from "../components/features/meal/WarningList";
import FavoriteButton from "../components/features/menu/FavoriteButton";
import MenuHeader from "../components/features/menu/MenuHeader";
import MenuList from "../components/features/menu/MenuList";
import NutritionTable from "../components/features/menu/NutritionTable";
import SourceNote from "../components/features/menu/SourceNote";
import { useAuth } from "../context/AuthContext";
import { useCategories } from "../hooks/useCategories";
import { useFavorites } from "../hooks/useFavorites";
import { useLookup } from "../hooks/useLookup";
import { useMenu } from "../hooks/useMenu";
import { useMenus } from "../hooks/useMenus";
import { useNutrientLimits } from "../hooks/useNutrientLimits";
import { usePageTitle } from "../hooks/usePageTitle";
import { useProfile } from "../hooks/useProfile";
import { DEFAULT_TARGETS, evaluateMenu } from "../utils/nutrition";
import NotFoundPage from "./NotFoundPage";

/** P04 รายละเอียดเมนู /menus/:menuId */
export default function MenuDetailPage() {
  const { menuId } = useParams();
  const validId = /^menu_\d{3}$/.test(menuId ?? "");
  const { uid } = useAuth();
  const { menu, status, retry } = useMenu(validId ? menuId : null);
  const menus = useMenus();
  const cats = useCategories();
  const limits = useNutrientLimits();
  const sources = useLookup("sources");
  const vendors = useLookup("vendor_types");
  const favs = useFavorites(uid);
  const { targets } = useProfile(uid);
  usePageTitle(menu?.name_th ?? "รายละเอียดเมนู");

  if (!validId || status === "empty") {
    return <NotFoundPage message="ไม่พบเมนูนี้" detail="รหัสเมนูไม่ถูกต้อง หรือเมนูถูกลบออกจากระบบแล้ว" />;
  }
  if (status === "error") {
    return <StateView kind="error" onRetry={retry} detail="ตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง หรือกดย้อนกลับไปหน้าก่อน" />;
  }
  if (status === "loading" || !menu) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="skeleton aspect-[4/3]" />
        <div className="space-y-3">
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
          <div className="skeleton h-40" />
        </div>
      </div>
    );
  }

  const category = cats.byId[menu.category_id];
  const tg = targets ?? DEFAULT_TARGETS;
  const warnings = evaluateMenu(menu, limits.limits);
  const related = menus.menus
    .filter((m) => m.category_id === menu.category_id && m.id !== menu.id && m.sodium_mg < menu.sodium_mg)
    .sort((a, b) => a.sodium_mg - b.sodium_mg)
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumb
          items={[
            { to: "/", label: "หน้าแรก" },
            { to: `/menus?category=${menu.category_id}`, label: category?.name_th ?? "เมนู" },
            { label: menu.name_th },
          ]}
        />
        <div className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
          <ImageWithFallback src={menu.image_detail} alt={menu.name_th} eager className="aspect-[4/3] w-full rounded-2xl" />
          <div className="space-y-4">
            <MenuHeader menu={menu} category={category} vendorType={vendors.map[menu.vendor_type_id]} />
            <div className="flex flex-wrap items-start gap-2">
              <AddMealButton menu={menu} />
              <FavoriteButton menuId={menu.id} isFavorite={favs.has.has(menu.id)} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section>
          <h2 className="mb-3 text-xl font-bold">คุณค่าทางโภชนาการ</h2>
          {limits.status === "ok" ? (
            <NutritionTable menu={menu} limits={limits.limits} targets={tg} />
          ) : (
            <StateView kind={limits.status === "error" ? "error" : "loading"} variant="block" onRetry={limits.retry} />
          )}
        </section>
        <section>
          <h2 className="mb-3 text-xl font-bold">ข้อควรรู้</h2>
          <WarningList warnings={warnings} emptyText="เมนูนี้ไม่มีสารอาหารที่ต้องจำกัดเกินครึ่งหนึ่งของเกณฑ์ต่อวัน" />
          <div className="mt-4">
            <SourceNote menu={menu} source={sources.map[menu.source_id]} />
          </div>
        </section>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold">เมนูหมวดเดียวกันที่โซเดียมน้อยกว่า</h2>
          <MenuList menus={related} />
        </section>
      )}
    </div>
  );
}
