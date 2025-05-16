/// Utility for mapping between Article model and ArticleDTO.
/// Provides conversion functions in both directions to maintain separation between
/// the database model and the data transfer object used for API responses.
enum ArticleMapping {
  /// Converts an Article database model to an ArticleDTO for API responses.
  /// - Parameter article: The Article model to convert.
  /// - Returns: A corresponding ArticleDTO populated with data from the Article.
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
  
  /// Converts an ArticleDTO to an Article database model.
  /// - Parameter articleDTO: The ArticleDTO to convert.
  /// - Returns: A corresponding Article model populated with data from the DTO.
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
