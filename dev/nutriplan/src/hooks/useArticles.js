import { useMemo } from "react";
import { subscribeArticle, subscribeArticles } from "../services/articleService";
import { useRealtime } from "./useRealtime";

export function useArticles() {
  const res = useRealtime("articles", subscribeArticles);
  const articles = useMemo(() => res.data ?? [], [res.data]);
  return { ...res, articles };
}

export function useArticle(articleId) {
  const res = useRealtime(articleId ? `articles/${articleId}` : null, (ok, err) =>
    subscribeArticle(articleId, ok, err),
  );
  return { ...res, article: res.data };
}
