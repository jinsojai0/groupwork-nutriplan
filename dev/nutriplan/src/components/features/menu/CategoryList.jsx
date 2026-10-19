import StateView from "../../common/StateView";
import CategoryCard from "./CategoryCard";

export default function CategoryList({ categories, status, onRetry }) {
  if (status === "loading") return <StateView kind="loading" variant="list" count={2} />;
  if (status === "error") return <StateView kind="error" onRetry={onRetry} />;
  if (!categories.length) return null;
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {categories.map((c) => (
        <CategoryCard key={c.id} category={c} />
      ))}
    </div>
  );
}
