import { useSearchParams } from "react-router-dom";
import ArticleList from "../components/features/article/ArticleList";
import { useArticles } from "../hooks/useArticles";
import { usePageTitle } from "../hooks/usePageTitle";
import { TOPIC_TH } from "../utils/format";

/** P09 บทความ /articles?topic= */
export default function ArticleListPage() {
  usePageTitle("บทความให้ความรู้");
  const [params, setParams] = useSearchParams();
  const topic = TOPIC_TH[params.get("topic")] ? params.get("topic") : "";
  const arts = useArticles();
  const list = arts.articles.filter((a) => !topic || a.topic === topic);
  const chip = (on) => `chip ${on ? "chip-on" : ""}`;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">บทความให้ความรู้</h1>
        <p className="text-slate-500">ความรู้ด้านโภชนาการที่เชื่อมกับคำเตือนในระบบ พร้อมแหล่งอ้างอิง</p>
      </div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="หัวข้อบทความ">
        <button type="button" className={chip(!topic)} aria-pressed={!topic} onClick={() => setParams({}, { replace: true })}>
          ทั้งหมด
        </button>
        {Object.entries(TOPIC_TH).map(([id, th]) => (
          <button key={id} type="button" className={chip(topic === id)} aria-pressed={topic === id} onClick={() => setParams({ topic: id }, { replace: true })}>
            {th}
          </button>
        ))}
      </div>
      <ArticleList articles={list} status={arts.status} onRetry={arts.retry} />
    </div>
  );
}
