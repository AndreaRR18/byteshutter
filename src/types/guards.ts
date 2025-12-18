import type {
  ArticleFeed,
  ArticleItem,
} from "../FeedSection/BlogList/BlogListRepository";
import type { Article } from "../FeedSection/BlogPost/BlogPostRepository";

export function isArticleItem(data: unknown): data is ArticleItem {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;

  return (
    typeof obj.title === "string" &&
    typeof obj.slug === "string" &&
    typeof obj.created_at === "string" &&
    typeof obj.excerpt === "string" &&
    (obj.tags === undefined || Array.isArray(obj.tags))
  );
}

export function isArticleFeed(data: unknown): data is ArticleFeed {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.articles)) return false;

  return obj.articles.every((article) => isArticleItem(article));
}

export function isArticle(data: unknown): data is Article {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;

  return (
    typeof obj.title === "string" &&
    typeof obj.slug === "string" &&
    typeof obj.created_at === "string" &&
    typeof obj.content === "string" &&
    (obj.excerpt === undefined || typeof obj.excerpt === "string") &&
    (obj.tags === undefined || Array.isArray(obj.tags))
  );
}
