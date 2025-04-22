import Fluent
import Vapor
import Foundation

struct ArticleDTO: Content, Sendable, Equatable {
  var id: UUID?
  var slug: String
  var title: String
  var excerpt: String
  var content: String
  var publicationDate: Date
  var isPublished: Bool
  var topics: [String]
  var createdAt: Date?
  var updatedAt: Date?
}
