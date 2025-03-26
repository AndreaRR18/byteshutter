import Fluent
import Vapor

struct SeedArticles: AsyncMigration {
  func prepare(on database: Database) async throws {
    let articles = [
      Article(
        id: UUID(),
        title: "Getting Started with Vapor",
        excerpt: "Learn how to build your first web application using Vapor and Swift on the server side.",
        content: """
                Vapor is a web framework for Swift that enables you to write your backend code using the same language you use for iOS development. This provides a seamless developer experience and allows you to leverage your existing Swift knowledge.
                
                ## Setting Up Your Environment
                
                First, make sure you have Swift installed on your system. Vapor requires Swift 5.5 or higher.
                
                To create a new Vapor project, use the Vapor Toolbox:
                
                ```bash
                brew install vapor
                vapor new MyProject
                cd MyProject
                swift run
                ```
                
                ## Key Concepts
                
                Vapor is built on Swift's concurrency features, and makes extensive use of async/await syntax. This makes your code more readable and easier to reason about compared to callback-based approaches.
                
                ### Routes
                
                Routes in Vapor define how your application responds to client requests. Here's a simple example:
                
                ```swift
                app.get("hello") { req async -> String in
                    return "Hello, world!"
                }
                ```
                
                ### Models
                
                Vapor's Fluent ORM allows you to define your data models in Swift and interact with the database using Swift code:
                
                ```swift
                final class User: Model {
                    static let schema = "users"
                    
                    @ID(key: .id)
                    var id: UUID?
                    
                    @Field(key: "name")
                    var name: String
                    
                    init() { }
                    
                    init(id: UUID? = nil, name: String) {
                        self.id = id
                        self.name = name
                    }
                }
                ```
                
                ## Next Steps
                
                Now that you have a basic understanding of Vapor, you can start building your own applications. Check out the official Vapor documentation for more detailed guides and examples.
                """,
        slug: "getting-started-with-vapor"
      ),
      Article(
        id: UUID(),
        title: "Swift Concurrency in Vapor",
        excerpt: "Explore how to leverage Swift's modern concurrency features in your Vapor applications.",
        content: "# Swift Concurrency in Vapor\n\nVapor 4 fully embraces Swift's async/await model...",
        slug: "swift-concurrency-in-vapor"
      ),
      Article(
        id: UUID(),
        title: "Building RESTful APIs with Vapor",
        excerpt: "A comprehensive guide to creating robust REST APIs using Vapor and Swift.",
        content: "# Building RESTful APIs with Vapor\n\nThis guide covers best practices...",
        slug: "restful-apis-with-vapor"
      ),
      Article(
        id: UUID(),
        title: "Authentication in Vapor",
        excerpt: "Implement secure user authentication in your Vapor applications.",
        content: "# Authentication in Vapor\n\nSecuring your application is critical...",
        slug: "authentication-in-vapor"
      ),
      Article(
        id: UUID(),
        title: "Fluent ORM: A Deep Dive",
        excerpt: "Master Vapor's powerful ORM system for database operations.",
        content: "# Fluent ORM: A Deep Dive\n\nFluent is Vapor's ORM system...",
        slug: "fluent-orm-deep-dive"
      ),
      Article(
        id: UUID(),
        title: "Deploying Vapor Applications",
        excerpt: "Learn how to deploy your Vapor application to production environments.",
        content: "# Deploying Vapor Applications\n\nThis guide covers various deployment options...",
        slug: "deploying-vapor-applications"
      ),
      Article(
        id: UUID(),
        title: "Websockets with Vapor",
        excerpt: "Implement real-time features using WebSockets in your Vapor app.",
        content: "# Websockets with Vapor\n\nWebSockets enable bidirectional communication...",
        slug: "websockets-with-vapor"
      ),
      Article(
        id: UUID(),
        title: "File Storage in Vapor",
        excerpt: "Techniques for handling file uploads and storage in Vapor applications.",
        content: "# File Storage in Vapor\n\nMany applications need to handle file uploads...",
        slug: "file-storage-in-vapor"
      ),
      Article(
        id: UUID(),
        title: "Testing Vapor Applications",
        excerpt: "Best practices for testing your Vapor application components.",
        content: "# Testing Vapor Applications\n\nTesting is crucial for maintaining quality...",
        slug: "testing-vapor-applications"
      ),
      Article(
        id: UUID(),
        title: "SwiftUI and Vapor Integration",
        excerpt: "Building full-stack Swift applications with SwiftUI and Vapor.",
        content: "# SwiftUI and Vapor Integration\n\nThe dream of full-stack Swift is here...",
        slug: "swiftui-and-vapor-integration"
      )
    ]
    
    for article in articles {
      try await article.save(on: database)
    }
  }
  
  func revert(on database: Database) async throws {
    try await Article.query(on: database).delete()
  }
}
