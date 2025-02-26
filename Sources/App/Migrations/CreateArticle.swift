import Fluent

struct CreateArticle: AsyncMigration {
  func prepare(on database: Database) async throws {
    try await database.schema("articles")
      .id()
      .field("title", .string, .required)
      .field("excerpt", .string, .required)
      .field("content", .string, .required)
      .field("created_at", .datetime)
      .field("slug", .string, .required)
      .unique(on: "slug")
      .create()
  }
  
  func revert(on database: Database) async throws {
    try await database.schema("articles").delete()
  }
}
