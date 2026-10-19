import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";
import StateView from "../components/common/StateView";
import MenuForm from "../components/features/admin/MenuForm";
import { useCategories } from "../hooks/useCategories";
import { useLookup } from "../hooks/useLookup";
import { useMenus } from "../hooks/useMenus";
import { usePageTitle } from "../hooks/usePageTitle";
import { nextMenuId, saveMenu } from "../services/menuService";
import NotFoundPage from "./NotFoundPage";

/** P14 ฟอร์มเพิ่ม/แก้ไขเมนู /admin/menus/new และ /admin/menus/:menuId/edit */
export default function AdminMenuFormPage() {
  const { menuId: editId } = useParams();
  const isNew = !editId;
  usePageTitle(isNew ? "เพิ่มเมนูใหม่" : `แก้ไข ${editId}`);
  const navigate = useNavigate();
  const menus = useMenus();
  const cats = useCategories();
  const vendors = useLookup("vendor_types");
  const sources = useLookup("sources");

  const all = [menus, cats, vendors, sources];
  if (all.some((r) => r.status === "error")) return <StateView kind="error" onRetry={() => all.forEach((r) => r.retry())} />;
  if (all.some((r) => r.status === "loading")) return <StateView kind="loading" variant="block" />;

  const menu = isNew ? null : menus.byId[editId];
  if (!isNew && !menu) return <NotFoundPage message="ไม่พบเมนูนี้" />;
  const menuId = isNew ? nextMenuId(menus.menus) : editId;

  const onSubmit = async (data) => {
    await saveMenu(menuId, data, isNew ? null : menu.category_id);
    navigate("/admin/menus", { replace: true });
  };

  return (
    <div>
      <Breadcrumb items={[{ to: "/admin/menus", label: "จัดการเมนู" }, { label: isNew ? "เพิ่มเมนูใหม่" : `แก้ไข ${menuId}` }]} />
      <h1 className="mb-5 text-2xl font-bold">
        {isNew ? "เพิ่มเมนูใหม่" : "แก้ไขเมนู"} <span className="font-mono text-lg text-slate-500">{menuId}</span>
      </h1>
      <MenuForm
        key={menuId}
        menuId={menuId}
        menu={menu}
        categories={cats.categories}
        vendorTypes={vendors.list}
        sources={sources.list}
        onSubmit={onSubmit}
        onCancel={() => navigate("/admin/menus")}
      />
    </div>
  );
}
