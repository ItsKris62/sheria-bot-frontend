import type { KnowledgeBaseArticle } from "./types";

export function formatKnowledgeBaseDate(value: string | Date | null | undefined) {
  if (!value) return "Recently";

  return new Intl.DateTimeFormat("en-KE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function getAuthorName(article: Pick<KnowledgeBaseArticle, "author">) {
  return article.author?.name || "SheriaBot Editorial Team";
}

export function deriveReadingTime(content: string | null | undefined, fallback?: number) {
  if (fallback && fallback > 0) return fallback;
  if (!content) return 1;

  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function getArticleExcerpt(article: Pick<KnowledgeBaseArticle, "excerpt">) {
  return article.excerpt || "Practical regulatory guidance from the SheriaBot knowledge base.";
}
