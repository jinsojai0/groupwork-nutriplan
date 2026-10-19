import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import ImageWithFallback from "../components/common/ImageWithFallback";
import SearchBar from "../components/common/SearchBar";
import ArticleList from "../components/features/article/ArticleList";
import CategoryList from "../components/features/menu/CategoryList";
import MenuList from "../components/features/menu/MenuList";
import { useArticles } from "../hooks/useArticles";
import { useCategories } from "../hooks/useCategories";
import { useMenus } from "../hooks/useMenus";
import { usePageTitle } from "../hooks/usePageTitle";
import { featuredMenus } from "../utils/nutrition";

const HOME_ARTICLES = ["article_03", "article_04", "article_05"];

/** P01 หน้าแรก */
export default function HomePage() {
  usePageTitle(null);
  const cats = useCategories();
  const menus = useMenus();
  const arts = useArticles();
  const featured = featuredMenus(menus.menus);
  const homeArticles = arts.articles.filter((a) => HOME_ARTICLES.includes(a.id));

  return (
    <div className="space-y-10">
      <section className="grid items-center gap-6 rounded-2xl bg-gradient-to-br from-brand-50 to-white p-6 md:grid-cols-[1.3fr_1fr] md:p-10">
        <div>
          <h1 className="text-3xl leading-tight font-bold md:text-4xl">
            รู้ค่าโภชนาการของอาหารจานเดียว
            <br className="hidden md:block" /> ก่อนสั่งทุกมื้อ
          </h1>
          <p className="mt-3 text-slate-600">
            พลังงาน โซเดียม และน้ำตาลของเมนูที่คุณกินจริง อ้างอิงฐานข้อมูลองค์ประกอบอาหารไทย พร้อมวางแผนมื้ออาหารให้อยู่ในงบ
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button to="/profile">ตั้งเป้าหมายของฉัน</Button>
            <Button to="/planner" variant="ghost">วางแผนมื้ออาหาร</Button>
          </div>
        </div>
        <ImageWithFallback
          src="images/menus/menu_007_detail.webp"
          alt="ข้าวผัดกะเพราหมูสับไข่ดาว"
          eager
          className="hidden aspect-[4/3] w-full rounded-2xl shadow-sm md:block"
        />
      </section>

      <section aria-label="ค้นหาเมนู">
        <SearchBar />
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">หมวดอาหาร</h2>
        <CategoryList categories={cats.categories} status={cats.status} onRetry={cats.retry} />
      </section>

      {(menus.status !== "ok" || featured.length > 0) && (
        <section>
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h2 className="text-xl font-bold">เมนูแนะนำ เบาและโซเดียมต่ำ</h2>
            <Link to="/menus?sort=sodium" className="shrink-0 text-sm text-brand-700 hover:underline">ดูทั้งหมด ›</Link>
          </div>
          <p className="-mt-2 mb-3 text-sm text-slate-500">พลังงานไม่เกิน 450 kcal โซเดียมไม่เกิน 1,200 มก. และไขมันไม่เกิน 20 ก.</p>
          <MenuList menus={featured} status={menus.status === "empty" ? "ok" : menus.status} onRetry={menus.retry} />
        </section>
      )}

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-xl font-bold">บทความให้ความรู้</h2>
          <Link to="/articles" className="text-sm text-brand-700 hover:underline">ดูทั้งหมด ›</Link>
        </div>
        <ArticleList articles={homeArticles} status={arts.status === "empty" ? "ok" : arts.status} onRetry={arts.retry} />
      </section>
    </div>
  );
}
