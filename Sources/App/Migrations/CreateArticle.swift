import Fluent

struct CreateArticle: AsyncMigration {
  func prepare(on database: Database) async throws {
    try await database.schema(Article.schema)
      .id()
      .field("title", .string, .required)
      .field("excerpt", .string, .required)
      .field("content", .string, .required)
      .field("publication_date", .datetime, .required)
      .field("is_published", .bool, .required)
      .field("created_at", .datetime)
      .field("updated_at", .datetime)
      .field("slug", .string, .required)
      .unique(on: "slug")
      .create()
  }
  
  func revert(on database: Database) async throws {
    try await database.schema("articles").delete()
  }
}
