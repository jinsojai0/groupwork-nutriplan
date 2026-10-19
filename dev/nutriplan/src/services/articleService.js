// บทความให้ความรู้ (F06)
import { subscribePath, toList } from "./firebase";

export function subscribeArticles(onData, onError) {
  return subscribePath("articles", onData, onError, (v) =>
    toList(v)
      .filter((a) => a.status === "PUBLISHED")
      .sort((a, b) => a.id.localeCompare(b.id)),
  );
}

export function subscribeArticle(articleId, onData, onError) {
  return subscribePath(`articles/${articleId}`, onData, onError, (v) =>
    v && v.status === "PUBLISHED" ? { id: articleId, ...v } : null,
  );
}
