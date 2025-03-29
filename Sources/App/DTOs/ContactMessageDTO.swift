import Foundation
import Vapor

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
