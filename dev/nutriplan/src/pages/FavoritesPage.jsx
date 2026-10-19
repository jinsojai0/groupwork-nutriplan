import Button from "../components/common/Button";
import MenuList from "../components/features/menu/MenuList";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../hooks/useFavorites";
import { useMenus } from "../hooks/useMenus";
import { usePageTitle } from "../hooks/usePageTitle";

/** P11 เมนูโปรด */
export default function FavoritesPage() {
  usePageTitle("เมนูโปรด");
  const { uid } = useAuth();
  const favs = useFavorites(uid);
  const menus = useMenus();
  const list = favs.ids.map((id) => menus.byId[id]).filter(Boolean);
  const status =
    favs.status === "error" || menus.status === "error"
      ? "error"
      : favs.status === "loading" || menus.status === "loading"
        ? "loading"
        : "ok";

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">เมนูโปรด</h1>
      <MenuList
        menus={list}
        status={status}
        onRetry={() => {
          favs.retry();
          menus.retry();
        }}
        emptyText="ยังไม่มีเมนูโปรด"
        emptyDetail="กด ♡ ที่หน้ารายละเอียดเมนูเพื่อเก็บเมนูที่สั่งบ่อยไว้ที่นี่"
        emptyAction={<Button size="sm" to="/menus">ดูเมนูทั้งหมด</Button>}
      />
    </div>
  );
}
