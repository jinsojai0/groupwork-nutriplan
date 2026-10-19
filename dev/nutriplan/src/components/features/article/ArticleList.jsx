import StateView from "../../common/StateView";
import ArticleCard from "./ArticleCard";

export default function ArticleList({ articles, status = "ok", onRetry, emptyText = "ยังไม่มีบทความในหัวข้อนี้" }) {
  if (status === "loading") return <StateView kind="loading" count={3} />;
  if (status === "error") return <StateView kind="error" onRetry={onRetry} />;
  if (!articles.length) return <StateView kind="empty" message={emptyText} detail="ลองเลือกหัวข้ออื่น" />;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((a) => (
        <ArticleCard key={a.id} article={a} />
      ))}
    </div>
  );
}
