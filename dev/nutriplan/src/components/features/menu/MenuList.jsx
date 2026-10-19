import StateView from "../../common/StateView";
import MenuCard from "./MenuCard";

/** รายการเมนูหรือสถานะ loading / empty / error (ใช้ร่วมกันหลายหน้า) */
export default function MenuList({ menus, status = "ok", emptyText, emptyDetail, emptyAction, onRetry, columns = 4 }) {
  if (status === "loading") return <StateView kind="loading" count={columns} />;
  if (status === "error") return <StateView kind="error" onRetry={onRetry} />;
  if (!menus?.length)
    return <StateView kind="empty" message={emptyText} detail={emptyDetail} action={emptyAction} />;
  const grid = columns === 3 ? "md:grid-cols-3" : columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3 lg:grid-cols-4";
  return (
    <div className={`grid grid-cols-2 gap-3 ${grid}`}>
      {menus.map((m) => (
        <MenuCard key={m.id} menu={m} />
      ))}
    </div>
  );
}
