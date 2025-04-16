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
  
  @Field(key: "slug")
  var slug: String
  
  @Field(key: "content")
  var content: String
  
  @Field(key: "publication_date")
  var publicationDate: Date
  
  @Field(key: "is_published")
  var isPublished: Bool
  
  @Timestamp(key: "created_at", on: .create)
  var createdAt: Date?
  
  @Timestamp(key: "updated_at", on: .update)
  var updatedAt: Date?
  
  init() {}
  
  init(
    id: UUID?,
    title: String,
    excerpt: String,
    slug: String,
    content: String,
    publicationDate: Date,
    isPublished: Bool
  ) {
    self.id = id
    self.title = title
    self.excerpt = excerpt
    self.slug = slug
    self.content = content
    self.publicationDate = publicationDate
    self.isPublished = isPublished 
  }
}
