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
    
    // Route to display the contact form
    contact.get { req -> View in
      return try await req.view.render("contact", [
        "success": false,
        "error": false
      ])
    }
    
    // Route to handle the form submission
    contact.post { req -> View in

      do {
        let form = try req.content.decode(ContactForm.self)
        
        // Validate the form data
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
        return try await req.view.render("contact", [
          "success": true,
          "error": false
        ])
      } catch {
        // Handle validation errors
        let errorMessage: String
        if let validationError = error as? ValidationError {
          errorMessage = validationError.message
        } else {
          errorMessage = "An unexpected error occurred while processing your message."
        }
        
        // Return the contact page with an error message
        return try await req.view.render("contact", [
          "success": "Success!",
          "error": "Failure!",
          "errorMessage": errorMessage
        ])
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
