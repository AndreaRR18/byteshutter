export class ArticleFeedDTO {
  title: string;
  excerpt: string;
  created_at: string;
  slug: string;
  tags?: string[];

  constructor(
    title: string,
    excerpt: string,
    created_at: string,
    tags?: string[]
  ) {
    this.title = title;
    this.excerpt = excerpt;
    this.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    this.created_at = created_at;
    this.tags = tags;
  }
}