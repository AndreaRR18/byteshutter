import Fluent
import Vapor

struct SeedArticles: AsyncMigration {
  func prepare(on database: Database) async throws {
    // Create sample articles
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
      ),
      Article(
        title: "Advanced Leaf Templates",
        excerpt: "Dive deep into Leaf templating engine and learn how to create reusable components.",
        content: """
                # Advanced Leaf Templates in Vapor
                
                Leaf is Vapor's templating language that helps you generate dynamic HTML content. While its basics are simple, Leaf offers advanced features that can help you build more sophisticated web applications.
                
                ## Custom Tags
                
                One of Leaf's powerful features is the ability to create custom tags:
                
                ```swift
                struct UppercaseTag: LeafTag {
                    func render(_ ctx: LeafContext) throws -> LeafData {
                        let string = try ctx.requireParameter(at: 0).string ?? ""
                        return .string(string.uppercased())
                    }
                }
                
                // Register the tag
                app.leaf.tags["uppercase"] = UppercaseTag()
                ```
                
                You can then use this tag in your Leaf templates:
                
                ```
                #uppercase("hello world")
                ```
                
                ## Layouts and Includes
                
                Reusing components is essential for maintaining a clean codebase. Leaf supports this with the `#extend` and `#import` tags:
                
                ```
                #extend("base"):
                    #export("title", "Welcome to my site")
                    #export("content"):
                        <h1>Welcome!</h1>
                        <p>This is my awesome site built with Vapor and Leaf.</p>
                    #endexport
                #endextend
                ```
                
                ## Loop Variables
                
                When working with loops, Leaf provides special variables to access loop metadata:
                
                ```
                #for(item in items):
                    <p>Item #(index): #(item.name)</p>
                    #if(isFirst):
                        <p>This is the first item!</p>
                    #endif
                    #if(isLast):
                        <p>This is the last item!</p>
                    #endif
                #endfor
                ```
                
                ## Conditionals
                
                Leaf offers powerful conditional statements:
                
                ```
                #if(user.isAdmin || user.role == "editor"):
                    <a href="/admin">Admin Panel</a>
                #elseif(user.isLoggedIn):
                    <a href="/profile">Your Profile</a>
                #else:
                    <a href="/login">Log In</a>
                #endif
                ```
                
                ## Best Practices
                
                1. **Keep templates organized**: Use folders to separate different types of templates
                2. **Create a component library**: Store reusable elements in separate files
                3. **Minimize logic in templates**: Move complex logic to the controller
                4. **Use consistent naming conventions**: This makes your templates easier to maintain
                
                By mastering these advanced Leaf features, you can create more maintainable and powerful templates for your Vapor applications.
                """,
        slug: "advanced-leaf-templates"
      ),
      Article(
        title: "RESTful APIs with Vapor",
        excerpt: "Explore best practices for building robust and scalable RESTful APIs using Swift and Vapor.",
        content: """
                # Building RESTful APIs with Vapor
                
                Vapor excels at creating RESTful APIs. Here's how to build a robust API that follows REST principles and best practices.
                
                ## API Structure
                
                A well-structured API should use meaningful routes and HTTP methods:
                
                - `GET /articles` - Retrieve all articles
                - `GET /articles/:id` - Retrieve a specific article
                - `POST /articles` - Create a new article
                - `PUT /articles/:id` - Update an article
                - `DELETE /articles/:id` - Delete an article
                
                ## Implementation
                
                Let's implement a basic RESTful controller in Vapor:
                
                ```swift
                struct ArticleController: RouteCollection {
                    func boot(routes: RoutesBuilder) throws {
                        let articles = routes.grouped("articles")
                        articles.get(use: index)
                        articles.post(use: create)
                        articles.group(":articleID") { article in
                            article.get(use: show)
                            article.put(use: update)
                            article.delete(use: delete)
                        }
                    }
                    
                    func index(req: Request) async throws -> [Article] {
                        try await Article.query(on: req.db).all()
                    }
                    
                    func show(req: Request) async throws -> Article {
                        guard let article = try await Article.find(req.parameters.get("articleID"), on: req.db) else {
                            throw Abort(.notFound)
                        }
                        return article
                    }
                    
                    func create(req: Request) async throws -> Article {
                        let article = try req.content.decode(Article.self)
                        try await article.save(on: req.db)
                        return article
                    }
                    
                    func update(req: Request) async throws -> Article {
                        guard let article = try await Article.find(req.parameters.get("articleID"), on: req.db) else {
                            throw Abort(.notFound)
                        }
                        let updated = try req.content.decode(Article.self)
                        article.title = updated.title
                        article.content = updated.content
                        try await article.save(on: req.db)
                        return article
                    }
                    
                    func delete(req: Request) async throws -> HTTPStatus {
                        guard let article = try await Article.find(req.parameters.get("articleID"), on: req.db) else {
                            throw Abort(.notFound)
                        }
                        try await article.delete(on: req.db)
                        return .noContent
                    }
                }
                ```
                
                ## Input Validation
                
                Always validate user input before processing it:
                
                ```swift
                struct CreateArticleDTO: Content, Validatable {
                    let title: String
                    let content: String
                    
                    static func validations(_ validations: inout Validations) {
                        validations.add("title", as: String.self, is: !.empty && .count(3...) )
                        validations.add("content", as: String.self, is: !.empty)
                    }
                }
                ```
                
                ## Response Formatting
                
                Consistent response formatting improves your API's usability:
                
                ```swift
                struct APIResponse<T: Content>: Content {
                    let status: String
                    let message: String?
                    let data: T?
                    
                    init(status: String = "success", message: String? = nil, data: T? = nil) {
                        self.status = status
                        self.message = message
                        self.data = data
                    }
                }
                ```
                
                ## Authentication
                
                Vapor provides several authentication mechanisms:
                
                ```swift
                // Configure basic authentication
                let protected = app.routes.grouped(User.authenticator())
                
                protected.post("login") { req -> UserToken in
                    let user = try req.auth.require(User.self)
                    let token = try UserToken.generate(for: user)
                    try await token.save(on: req.db)
                    return token
                }
                ```
                
                ## Versioning
                
                Version your API to ensure compatibility as it evolves:
                
                ```swift
                // Group routes by version
                let v1 = app.grouped("api", "v1")
                let v2 = app.grouped("api", "v2")
                
                // Register different controllers for different versions
                try v1.register(collection: ArticleControllerV1())
                try v2.register(collection: ArticleControllerV2())
                ```
                
                Following these practices will help you build a robust, maintainable, and user-friendly API with Vapor.
                """,
        slug: "restful-apis-with-vapor"
      ),
      Article(
        title: "Deploying Vapor Applications",
        excerpt: "Learn how to deploy your Vapor application to production environments using Docker and cloud providers.",
        content: """
                # Deploying Vapor Applications
                
                Building a Vapor application is just the first step. Deploying it properly ensures your users can access it reliably.
                
                ## Docker Deployment
                
                Vapor projects come with a Dockerfile that makes containerization straightforward:
                
                ```bash
                # Build the Docker image
                docker build -t my-vapor-app .
                
                # Run the container
                docker run -p 8080:8080 my-vapor-app
                ```
                
                For production, consider using docker-compose to manage your app and its dependencies:
                
                ```yaml
                version: '3'
                services:
                  app:
                    build: .
                    ports:
                      - "8080:8080"
                    depends_on:
                      - db
                    environment:
                      - DATABASE_HOST=db
                      - LOG_LEVEL=info
                  db:
                    image: postgres:13
                    environment:
                      - POSTGRES_USER=vapor
                      - POSTGRES_PASSWORD=password
                      - POSTGRES_DB=vapor
                    volumes:
                      - postgres-data:/var/lib/postgresql/data
                
                volumes:
                  postgres-data:
                ```
                
                ## Cloud Deployment Options
                
                ### Heroku
                
                Heroku offers a straightforward deployment process:
                
                1. Create a `Procfile` in your project root:
                   ```
                   web: Run serve --env production --hostname 0.0.0.0 --port $PORT
                   ```
                
                2. Deploy with the Heroku CLI:
                   ```bash
                   heroku create my-vapor-app
                   heroku buildpacks:set vapor/vapor
                   git push heroku main
                   ```
                
                ### DigitalOcean App Platform
                
                DigitalOcean's App Platform supports Dockerfile deployments:
                
                1. Create a new app on the DigitalOcean dashboard
                2. Link your GitHub repository
                3. Configure your app to build from the Dockerfile
                4. Deploy
                
                ### AWS Elastic Beanstalk
                
                For more complex deployments, AWS Elastic Beanstalk provides good flexibility:
                
                1. Create a `.ebextensions` directory in your project
                2. Create a `Dockerrun.aws.json` file with your configuration
                3. Deploy using the EB CLI:
                   ```bash
                   eb init
                   eb create production
                   ```
                
                ## Configuring for Production
                
                Regardless of your deployment platform, ensure you configure these aspects properly:
                
                ### Environment Variables
                
                Use environment variables for sensitive configuration:
                
                ```swift
                let key = Environment.get("API_KEY") ?? "default-development-key"
                ```
                
                ### HTTPS
                
                Always use HTTPS in production:
                
                ```swift
                if app.environment == .production {
                    app.http.server.configuration.tlsConfiguration = TLSConfiguration.makeServerConfiguration(
                        certificateChain: [.certificate(.file("cert.pem"))],
                        privateKey: .file("key.pem")
                    )
                }
                ```
                
                ### Logging
                
                Configure appropriate logging levels:
                
                ```swift
                let logLevel = Environment.get("LOG_LEVEL").flatMap { Logger.Level(rawValue: $0) } ?? .info
                app.logger.logLevel = logLevel
                ```
                
                ### Database Migrations
                
                Run migrations on startup in a controlled manner:
                
                ```swift
                if app.environment == .production {
                    try await app.autoMigrate()
                }
                ```
                
                By following these deployment practices, you'll ensure your Vapor application runs reliably in production environments.
                """,
        slug: "deploying-vapor-applications"
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
