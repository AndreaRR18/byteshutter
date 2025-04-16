import Fluent

struct CreateCollection: AsyncMigration {
  
  func prepare(on database: any Database) async throws {
    try await database.schema(Collection.schema)
      .id()
      .field("name", .string, .required)
      .field("slug", .string, .required)
      .field("description", .string)
      .field("created_at", .datetime)
      .unique(on: "slug")
      .create()
  }
  
  func revert(on database: any Database) async throws {
    try await database.schema("collections").delete()
  }
}
