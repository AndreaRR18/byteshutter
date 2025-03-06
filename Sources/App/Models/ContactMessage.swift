import Fluent
import Vapor
import struct Foundation.UUID
import struct Foundation.Date

final class ContactMessage: Model, @unchecked Sendable {
  static let schema = "contact_messages"
  
  @ID(key: .id)
  var id: UUID?
  
  @Field(key: "email")
  var email: String
  
  @Field(key: "subject")
  var subject: String
  
  @Field(key: "message")
  var message: String
  
  @Timestamp(key: "created_at", on: .create)
  var createdAt: Date?
  
  init() { }
  
  init(id: UUID? = nil, email: String, subject: String, message: String) {
    self.id = id
    self.email = email
    self.subject = subject
    self.message = message
  }
}

struct ContactMessageDTO: Content {
  var id: UUID?
  var email: String
  var subject: String
  var message: String
  var createdAt: Date?
  
  init(from model: ContactMessage) {
    self.id = model.id
    self.email = model.email
    self.subject = model.subject
    self.message = model.message
    self.createdAt = model.createdAt
  }
}
