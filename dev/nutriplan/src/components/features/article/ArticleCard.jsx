import { Link } from "react-router-dom";
import { TOPIC_TH } from "../../../utils/format";
import ImageWithFallback from "../../common/ImageWithFallback";


export default function ArticleCard({ article, horizontal = false }) {
  return (
    <Link
      to={`/articles/${article.id}`}
      className={`card group flex overflow-hidden transition hover:border-brand-300 hover:shadow-md ${horizontal ? "flex-row" : "flex-col"}`}
    >
      <ImageWithFallback
        src={article.cover_image}
        alt=""
        className={horizontal ? "w-28 shrink-0 sm:w-36" : "aspect-video w-full"}
      />
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-xs font-medium text-brand-600">{TOPIC_TH[article.topic] ?? article.topic}</span>
        <h3 className="line-clamp-2 leading-snug font-semibold group-hover:text-brand-700">{article.title_th}</h3>
        {!horizontal && <p className="line-clamp-2 text-sm text-slate-500">{article.summary}</p>}
        <span className="mt-auto pt-1 text-xs text-slate-500">อ่าน {article.reading_minutes} นาที</span>
      </div>
    </Link>
  );
}
