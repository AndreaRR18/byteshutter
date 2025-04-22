import Fluent
import Vapor
import Foundation

struct CollectionDTO: Content, Sendable, Equatable {
  var id: UUID?
  var name: String
  var slug: String
  var description: String?
  var createdAt: Date?
}
