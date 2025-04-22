enum ArticleMapping {
  static func toDTO(from article: Article) -> ArticleDTO {
    ArticleDTO(
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      publicationDate: article.publicationDate,
      isPublished: article.isPublished,
      topics: article.topics
    )
  }
  
  static func toModel(from articleDTO: ArticleDTO) -> Article {
    Article(
      id: articleDTO.id,
      title: articleDTO.title,
      excerpt: articleDTO.excerpt,
      slug: articleDTO.slug,
      content: articleDTO.content,
      publicationDate: articleDTO.publicationDate,
      isPublished: articleDTO.isPublished,
      topics: articleDTO.topics
    )
  }
}
