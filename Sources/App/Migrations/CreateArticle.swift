import Fluent

struct CreateArticle: AsyncMigration {
  func prepare(on database: Database) async throws {
    try await database.schema(Article.schema)
      .id()
      .field("title", .string, .required)
      .field("excerpt", .string, .required)
      .field("content", .string, .required)
      .field("publicationDate", .datetime, .required)
      .field("isPublished", .bool, .required)
      .field("topics", .array(of: .string), .required)
      .field("createdAt", .datetime)
      .field("updatedAt", .datetime)
      .field("slug", .string, .required)
      .unique(on: "slug")
      .create()
  }
  
  func revert(on database: Database) async throws {
    try await database.schema("articles").delete()
  }
}
