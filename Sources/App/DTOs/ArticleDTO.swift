import Fluent
import Vapor
import struct Foundation.Date

struct ArticleDTO: Content, Sendable {
  var id: UUID?
  var title: String
  var excerpt: String
  var content: String
  var createdAt: Date?
  var slug: String
  
  func toModel() -> Article {
    let model = Article()
    
    model.id = self.id
    model.title = self.title
    model.excerpt = self.excerpt
    model.content = self.content
    model.slug = self.slug
    
    return model
  }
}

extension ArticleDTO: Equatable {
  public static func == (lhs: Self, rhs: Self) -> Bool {
    lhs.id == rhs.id &&
    lhs.title == rhs.title &&
    lhs.excerpt == rhs.excerpt &&
    lhs.content == rhs.content &&
    lhs.slug == rhs.slug
  }
}
