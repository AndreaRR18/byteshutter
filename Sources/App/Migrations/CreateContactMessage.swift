import Fluent

struct CreateContactMessage: AsyncMigration {
  func prepare(on database: Database) async throws {
    try await database.schema(ContactMessage.schema)
      .id()
      .field("email", .string, .required)
      .field("subject", .string, .required)
      .field("message", .string, .required)
      .field("createdAt", .datetime)
      .create()
  }
  
  func revert(on database: Database) async throws {
    try await database.schema("contactMessages").delete()
  }
}
