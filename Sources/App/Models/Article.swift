import Fluent
import Foundation

final class Article: Model, @unchecked Sendable {
  static let schema = "articles"
  
  @ID(key: .id)
  var id: UUID?
  
  @Field(key: "title")
  var title: String
  
  @Field(key: "excerpt")
  var excerpt: String
  
  @Field(key: "content")
  var content: String
  
  @Timestamp(key: "created_at", on: .create)
  var createdAt: Date?
  
  @Field(key: "slug")
  var slug: String
  
  init() {}
  
  init(
    id: UUID?,
    title: String,
    excerpt: String,
    content: String,
    slug: String
  ) {
    self.id = id
    self.title = title
    self.excerpt = excerpt
    self.content = content
    self.slug = slug
  }
  
  func toDTO() -> ArticleDTO {
    .init(
      id: self.id,
      title: self.title,
      excerpt: self.excerpt,
      content: self.content,
      createdAt: self.createdAt,
      slug: self.slug
    )
  }
}
