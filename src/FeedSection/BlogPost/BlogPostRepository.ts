import { isArticle } from "../../types/guards";

export interface Article {
  title: string;
  created_at: string;
  slug: string;
  tags?: string[];
  content: string;
  excerpt?: string;
}

class BlogPostRepository {
  private articleCache: Map<string, Article> = new Map();

  async getArticleBySlug(slug: string): Promise<Article | null> {
    const cached = this.articleCache.get(slug);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(
        `${import.meta.env.BASE_URL}data/${slug}.json`,
      );
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (!isArticle(data)) {
        throw new Error(`Invalid article structure for slug: ${slug}`);
      }

      this.articleCache.set(slug, data);
      return data;
    } catch {
      return null;
    }
  }
}

export const articleDetailRepository = new BlogPostRepository();
