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

    try {
      const url = `${import.meta.env.BASE_URL}data/articles.json`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch articles: ${response.status} ${response.statusText}`,
        );
      }
      this.indexCache = (await response.json()) as ArticleFeed;
      return this.indexCache;
    } catch (error) {
      console.error("Failed to load article index:", error);
      throw error;
    }
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
