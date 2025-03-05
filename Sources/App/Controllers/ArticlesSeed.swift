import Fluent
import Vapor

struct SeedArticles: AsyncMigration {
  func prepare(on database: Database) async throws {
    let articles = [
      Article(
        title: "Getting Started with Vapor",
        excerpt: "Learn how to build your first web application using Vapor and Swift on the server side.",
        content: """
                # Getting Started with Vapor
                
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
