import Fluent
import Foundation
import Vapor

final class Article: Model, Content, @unchecked Sendable {
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
  
  @Field(key: "publicationDate")
  var publicationDate: Date
  
  @Field(key: "isPublished")
  var isPublished: Bool
  
  @Field(key: "topics")
  var topics: [String]
  
  @Timestamp(key: "createdAt", on: .create)
  var createdAt: Date?
  
  @Timestamp(key: "updatedAt", on: .update)
  var updatedAt: Date?
  
  init() {}
  
  init(
    id: UUID?,
    title: String,
    excerpt: String,
    slug: String,
    content: String,
    publicationDate: Date,
    isPublished: Bool,
    topics: [String]
  ) {
    self.id = id
    self.title = title
    self.excerpt = excerpt
    self.slug = slug
    self.content = content
    self.publicationDate = publicationDate
    self.isPublished = isPublished
    self.topics = topics
  }
}
