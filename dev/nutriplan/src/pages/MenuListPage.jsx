import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";
import Button from "../components/common/Button";
import MenuFilterBar from "../components/features/menu/MenuFilterBar";
import MenuList from "../components/features/menu/MenuList";
import { useCategories } from "../hooks/useCategories";
import { useMenus } from "../hooks/useMenus";
import { usePageTitle } from "../hooks/usePageTitle";
import { SORT_OPTIONS } from "../utils/format";

/** P02 รายการเมนู : ตัวกรองเก็บใน URL (?category=&veg=&sort=) จึงแชร์ลิงก์และกดย้อนกลับได้ */
export default function MenuListPage() {
  const [params, setParams] = useSearchParams();
  const value = {
    category: params.get("category") ?? "",
    veg: params.get("veg") === "1",
    sort: SORT_OPTIONS.some((o) => o.id === params.get("sort")) ? params.get("sort") : "sodium",
  };
  const cats = useCategories();
  const menus = useMenus();
  const category = cats.byId[value.category];
  usePageTitle(category?.name_th ?? "เมนูทั้งหมด");

  const onChange = (patch) => {
    const next = { ...value, ...patch };
    const p = new URLSearchParams();
    if (next.category) p.set("category", next.category);
    if (next.veg) p.set("veg", "1");
    if (next.sort !== "sodium") p.set("sort", next.sort);
    setParams(p, { replace: true });
  };

  const field = SORT_OPTIONS.find((o) => o.id === value.sort).field;
  const list = menus.menus
    .filter((m) => !value.category || m.category_id === value.category)
    .filter((m) => !value.veg || m.is_vegetarian)
    .sort((a, b) => a[field] - b[field] || a.id.localeCompare(b.id));
  const title = category?.name_th ?? (value.category && cats.status === "ok" ? "ไม่พบหมวดนี้" : "เมนูทั้งหมด");
  const status = menus.status === "ok" && cats.status === "error" ? "ok" : menus.status;

  return (
    <div>
      <Breadcrumb items={[{ to: "/", label: "หน้าแรก" }, { label: title }]} />
      <h1 className="mb-1 text-2xl font-bold">
        {title}
        {status === "ok" && <span className="ml-2 text-base font-normal text-slate-500">({list.length} เมนู)</span>}
      </h1>
      {category?.description && <p className="mb-4 text-slate-500">{category.description}</p>}
      <div className="mt-4 mb-5">
        <MenuFilterBar categories={cats.categories} value={value} onChange={onChange} />
      </div>
      <MenuList
        menus={list}
        status={status}
        onRetry={menus.retry}
        emptyText="ไม่พบเมนูในหมวดนี้"
        emptyDetail="ลองล้างตัวกรองเพื่อดูเมนูทั้งหมด"
        emptyAction={<Button size="sm" variant="ghost" onClick={() => setParams({})}>ล้างตัวกรอง</Button>}
      />
    </div>
  );
}
