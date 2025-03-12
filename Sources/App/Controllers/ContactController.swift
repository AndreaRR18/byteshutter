import Vapor
import Fluent

struct ContactController: RouteCollection {
  // Decode the form data
  struct ContactForm: Content {
    var email: String
    var subject: String
    var message: String
  }
  
  func boot(routes: RoutesBuilder) throws {
    let contact = routes.grouped("contact")
    
    contact.get { req -> View in
      return try await req.view.render(
        "contact",
        ContactContext(result: .none)
      )
    }
    
    contact.post { req -> View in
      
      do {
        let form = try req.content.decode(ContactForm.self)
        
        try validateContactForm(form)
        
        // In a real application, you would send the email here
        // For now, we'll save the message to the database
        let contactMessage = ContactMessage(
          email: form.email,
          subject: form.subject,
          message: form.message
        )
        
        try await contactMessage.save(on: req.db)
        req.logger.info("Contact form submission saved: \(form.email), \(form.subject)")
        
        // Return the contact page with a success message
        return try await req.view.render(
          "contact",
          ContactContext(result: .success)
        )
      } catch {
        // Handle validation errors
        let errorMessage: String
        if let validationError = error as? ValidationError {
          errorMessage = validationError.message
        } else {
          errorMessage = "An unexpected error occurred while processing your message."
        }
        
        // Return the contact page with an error message
        return try await req.view.render(
          "contact",
          ContactContext(result: .error(errorMessage: errorMessage))
        )
      }
    }
  }
  
  private func validateContactForm(_ form: ContactForm) throws {
    // Custom validation error type
    struct ValidationError: Error {
      let message: String
    }
    
    // Check if email is valid
    if form.email.isEmpty {
      throw ValidationError(message: "Email is required")
    }
    
    if !form.email.contains("@") || !form.email.contains(".") {
      throw ValidationError(message: "Please enter a valid email address")
    }
    
    // Check if subject is valid
    if form.subject.isEmpty {
      throw ValidationError(message: "Subject is required")
    }
    
    if form.subject.count < 3 {
      throw ValidationError(message: "Subject must be at least 3 characters long")
    }
    
    // Check if message is valid
    if form.message.isEmpty {
      throw ValidationError(message: "Message is required")
    }
    
    if form.message.count < 10 {
      throw ValidationError(message: "Message must be at least 10 characters long")
    }
  }
}

// Extension to register this controller in the application
extension ContactController {
  struct ValidationError: Error {
    let message: String
  }
}

struct ContactContext: Encodable {
  var success: Bool
  var error: Bool
  var errorMessage: String?
  
  init(result: Result) {
    switch result {
    case .none:
      success = false
      error = false
      errorMessage = nil
      
    case .success:
      success = true
      error = false
      errorMessage = nil
      
    case .error(let errorMessage):
      success = false
      error = true
      self.errorMessage = errorMessage
    }
  }
  
  enum Result {
    case none
    case success
    case error(errorMessage: String?)
  }
}
