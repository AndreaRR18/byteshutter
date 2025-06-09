export interface Article {
  title: string;
  date: string;
  slug: string;
  tags?: string[];
  content: string;
  contentHtml: string;
}

class ArticleDetailRepository {
  private articleCache: Map<string, Article> = new Map();

  async getArticleBySlug(slug: string): Promise<Article | null> {
    if (this.articleCache.has(slug)) {
      return this.articleCache.get(slug)!;
    }

    try {
      const response = await fetch(`/data/${slug}.json`);
      if (!response.ok) {
        return null;
      }
      
      const article = await response.json();
      this.articleCache.set(slug, article);
      return article;
    } catch (error) {
      console.error(`Failed to load article ${slug}:`, error);
      return null;
    }
  }
}

export const articleDetailRepository = new ArticleDetailRepository();