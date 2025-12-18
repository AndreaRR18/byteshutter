import { isArticleFeed } from "../../types/guards";

export interface ArticleItem {
  title: string;
  created_at: string;
  slug: string;
  excerpt: string;
  tags?: string[];
}

export interface ArticleFeed {
  articles: ArticleItem[];
}

class FeedRepository {
  private indexCache: ArticleFeed | null = null;

  async getArticles(): Promise<ArticleFeed> {
    if (this.indexCache) {
      return this.indexCache;
    }

    const url = `${import.meta.env.BASE_URL}data/articles.json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch articles: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    if (!isArticleFeed(data)) {
      throw new Error("Invalid article feed structure");
    }

    this.indexCache = data;
    return this.indexCache;
  }

  async getArticlesByTag(tag: string): Promise<ArticleItem[]> {
    const index = await this.getArticles();
    return index.articles.filter((article) => article.tags?.includes(tag));
  }

  async getRecentArticles(limit: number = 5): Promise<ArticleItem[]> {
    const index = await this.getArticles();
    return index.articles.slice(0, limit);
  }

  async searchArticles(query: string): Promise<ArticleItem[]> {
    const index = await this.getArticles();
    const lowerQuery = query.toLowerCase();

    return index.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.excerpt?.toLowerCase().includes(lowerQuery) ||
        article.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    );
  }
}

export const feedRepository = new FeedRepository();
