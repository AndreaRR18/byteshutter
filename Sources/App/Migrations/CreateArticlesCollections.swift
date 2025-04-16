import Fluent

struct CreateArticlesCollections: AsyncMigration {
  
  func prepare(on database: any Database) async throws {
    try await database.schema(ArticlesCollections.schema)
      .id()
      .field("article_id", .uuid, .references(Article.schema, "id"), .required)
      .field("collection_id", .uuid, .references(Collection.schema, "id"), .required)
      .create()
  }
  
  func revert(on database: any Database) async throws {
    try await database.schema("collections").delete()
  }
}
