import NIOSSL
import Fluent
import FluentPostgresDriver
import Leaf
import Vapor

// configures your application
public func configure(_ app: Application) async throws {
  // serve files from /Public folder
  app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))
  
  if app.environment == .production {
      try AppEnvironment.validateRequiredVariables()
  }
  
  // Configure database using environment variables from .env
  app.databases.use(DatabaseConfigurationFactory.postgres(configuration: .init(
    hostname: Environment.get("DATABASE_HOST") ?? "localhost",
    port: Environment.get("DATABASE_PORT").flatMap(Int.init(_:)) ?? SQLPostgresConfiguration.ianaPortNumber,
    username: Environment.get("DATABASE_USERNAME") ?? "",
    password: Environment.get("DATABASE_PASSWORD") ?? "",
    database: Environment.get("DATABASE_NAME") ?? "",
    tls: .prefer(try .init(configuration: .clientDefault)))
  ), as: .psql)
  
  
  // Add database migrations
  app.migrations.add(CreateArticle())
  app.migrations.add(SeedArticles())
  
  app.views.use(.leaf)
  
  // Configure server settings from environment if needed
   // Use a non-default port for development to avoid conflicts
   app.http.server.configuration.port = Environment.get("SERVER_PORT").flatMap(Int.init) ?? 9000
   
   if let hostname = Environment.get("SERVER_HOSTNAME") {
       app.http.server.configuration.hostname = hostname
   }

  // register routes
  try routes(app)
}

extension AppEnvironment {
    /// Validate that all required environment variables are set
    static func validateRequiredVariables() throws {
        let missingVariables = requiredVariables.filter { Environment.get($0) == nil }
        
        guard missingVariables.isEmpty else {
            throw Abort(.internalServerError, reason: "Missing required environment variables: \(missingVariables.joined(separator: ", "))")
        }
    }
    
    /// List of environment variables that are required for the application to run
    private static let requiredVariables: [String] = [
        "DATABASE_HOST",
        "DATABASE_USERNAME",
        "DATABASE_PASSWORD",
        "DATABASE_NAME"
    ]
}
