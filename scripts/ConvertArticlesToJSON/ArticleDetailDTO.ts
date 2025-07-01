export class ArticleDetailDTO {
  title: string;
  created_at: string;
  slug: string;
  tags?: string[];
  content: string;

  constructor(
    title: string,
    created_at: string,
    content: string,
    tags?: string[],
  ) {
    this.title = title;
    this.created_at = created_at;
    this.slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    this.content = content;
    this.tags = tags;
  }
}
