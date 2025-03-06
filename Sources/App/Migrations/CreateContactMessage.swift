import Fluent

struct CreateContactMessage: AsyncMigration {
  func prepare(on database: Database) async throws {
    try await database.schema("contact_messages")
      .id()
      .field("email", .string, .required)
      .field("subject", .string, .required)
      .field("message", .string, .required)
      .field("created_at", .datetime)
      .create()
  }
  
  func revert(on database: Database) async throws {
    try await database.schema("contact_messages").delete()
  }
}
