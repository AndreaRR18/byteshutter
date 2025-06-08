
export interface Article {
  title: string;
  created_at: string;
  slug: string;
  excerpt: string;
  tags?: string[];
}

export interface ArticleFeed {
  articles: Article[];
}

