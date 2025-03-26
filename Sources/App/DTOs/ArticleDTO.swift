import Fluent
import Vapor
import Foundation

struct ArticleDTO: Content, Sendable, Equatable {
  var id: UUID?
  var title: String
  var excerpt: String
  var content: String
  var createdAt: Date?
  var slug: String
  
  func toModel() -> Article {
    Article(
      id: id,
      title: title,
      excerpt: excerpt,
      content: content,
      slug: slug
    )
  }
}
