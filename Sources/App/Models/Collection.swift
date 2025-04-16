import Fluent
import Foundation

final class Collection: Model, @unchecked Sendable {
  static let schema = "collections"
  
  @ID(key: .id)
  var id: UUID?
  
  @Field(key: "name")
  var name: String
  
  @Field(key: "slug")
  var slug: String
  
  @Field(key: "description")
  var description: String?
  
  @Timestamp(key: "created_at", on: .create)
  var createdAt: Date?
  
  init() {}
  
  init(
    id: UUID?,
    name: String,
    slug: String,
    description: String?,
    createdAt: Date?
  ) {
    self.id = id
    self.name = name
    self.slug = slug
    self.description = description
    self.createdAt = createdAt
  }
}
