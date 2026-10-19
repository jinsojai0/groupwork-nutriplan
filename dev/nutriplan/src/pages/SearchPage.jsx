import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/common/SearchBar";
import ArticleCard from "../components/features/article/ArticleCard";
import CategoryList from "../components/features/menu/CategoryList";
import MenuList from "../components/features/menu/MenuList";
import { useArticles } from "../hooks/useArticles";
import { useCategories } from "../hooks/useCategories";
import { useMenus } from "../hooks/useMenus";
import { usePageTitle } from "../hooks/usePageTitle";
import { searchMenus } from "../utils/nutrition";

/** P03 ผลการค้นหา /search?q= */
export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  usePageTitle(q ? `ค้นหา “${q}”` : "ค้นหาเมนู");
  const menus = useMenus();
  const arts = useArticles();
  const cats = useCategories();

  const results = searchMenus(menus.menus, q);
  const k = q.toLowerCase();
  const relatedArticles = q
    ? arts.articles.filter((a) => `${a.title_th} ${a.summary} ${a.title_en}`.toLowerCase().includes(k)).slice(0, 3)
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ค้นหาเมนู</h1>
      <SearchBar key={q} defaultValue={q} onSearch={(v) => setParams(v ? { q: v } : {})} />
      {!q ? (
        <section>
          <p className="mb-3 text-slate-500">พิมพ์ชื่อเมนูหรือวัตถุดิบเพื่อค้นหา หรือเลือกดูตามหมวดอาหาร</p>
          <CategoryList categories={cats.categories} status={cats.status} onRetry={cats.retry} />
        </section>
      ) : (
        <>
          <section>
            {menus.status === "ok" && (
              <p className="mb-3 text-slate-600" aria-live="polite">
                ผลการค้นหา “{q}” พบ {results.length} เมนู
              </p>
            )}
            <MenuList
              menus={results}
              status={menus.status}
              onRetry={menus.retry}
              emptyText={`ไม่พบเมนู “${q}”`}
              emptyDetail="ลองใช้คำที่สั้นลง เช่น “กะเพรา” หรือ “ต้ม” หรือเลือกดูตามหมวดด้านล่าง"
            />
          </section>
          {menus.status === "ok" && results.length === 0 && (
            <section>
              <h2 className="mb-3 text-lg font-bold">เลือกดูตามหมวดอาหาร</h2>
              <CategoryList categories={cats.categories} status={cats.status} onRetry={cats.retry} />
            </section>
          )}
          {relatedArticles.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-bold">บทความที่เกี่ยวข้อง</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {relatedArticles.map((a) => <ArticleCard key={a.id} article={a} horizontal />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
