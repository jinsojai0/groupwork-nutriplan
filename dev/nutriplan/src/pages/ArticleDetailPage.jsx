import { Link, useParams } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";
import ImageWithFallback from "../components/common/ImageWithFallback";
import StateView from "../components/common/StateView";
import KeyPointList from "../components/features/article/KeyPointList";
import SourceList from "../components/features/article/SourceList";
import { useArticle } from "../hooks/useArticles";
import { useLookup } from "../hooks/useLookup";
import { usePageTitle } from "../hooks/usePageTitle";
import { thaiDate, TOPIC_TH } from "../utils/format";
import NotFoundPage from "./NotFoundPage";

/** P10 รายละเอียดบทความ /articles/:articleId */
export default function ArticleDetailPage() {
  const { articleId } = useParams();
  const validId = /^article_\d{2}$/.test(articleId ?? "");
  const { article, status, retry } = useArticle(validId ? articleId : null);
  const sources = useLookup("sources");
  usePageTitle(article?.title_th ?? "บทความ");

  if (!validId || status === "empty") return <NotFoundPage message="ไม่พบบทความนี้" detail="บทความอาจถูกย้ายหรือยังไม่เผยแพร่" />;
  if (status === "error") return <StateView kind="error" onRetry={retry} />;
  if (status === "loading" || !article) return <StateView kind="loading" variant="block" />;

  return (
    <article className="mx-auto max-w-3xl">
      <Breadcrumb items={[{ to: "/", label: "หน้าแรก" }, { to: "/articles", label: "บทความ" }, { label: article.title_th }]} />
      <ImageWithFallback src={article.cover_image} alt="" eager className="aspect-video w-full rounded-2xl" />
      <div className="mt-5 space-y-1">
        <Link to={`/articles?topic=${article.topic}`} className="text-sm font-medium text-brand-600 hover:underline">
          {TOPIC_TH[article.topic] ?? article.topic}
        </Link>
        <h1 className="text-2xl leading-tight font-bold md:text-3xl">{article.title_th}</h1>
        <p className="text-sm text-slate-500">
          อ่าน {article.reading_minutes} นาที · เผยแพร่ {thaiDate(article.published_at)}
        </p>
      </div>
      <p className="mt-4 text-lg text-slate-700">{article.summary}</p>
      <section className="mt-6">
        <h2 className="mb-3 text-xl font-bold">ประเด็นสำคัญ</h2>
        <KeyPointList points={article.key_points ?? []} />
      </section>
      <section className="mt-8 border-t border-slate-200 pt-5">
        <h2 className="mb-2 text-lg font-bold">แหล่งอ้างอิง</h2>
        <SourceList sourceIds={article.source_ids ?? []} sources={sources.map} />
      </section>
      <p className="mt-6 text-xs text-slate-400">ภาพปกเป็นภาพประกอบที่สร้างด้วย AI ไม่ใช่ภาพถ่ายอาหารจริง</p>
    </article>
  );
}
