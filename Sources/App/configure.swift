import NIOSSL
import Fluent
import FluentPostgresDriver
import Leaf
import Vapor

public func configure(_ app: Application) async throws {
  app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))
  
  // Configure database using environment variables from .env
  app.databases.use(DatabaseConfigurationFactory.postgres(configuration: .init(
    hostname: AppEnvironment.hostname,
    port: AppEnvironment.port,
    username: AppEnvironment.username,
    password: AppEnvironment.password,
    database: AppEnvironment.database,
    tls: .prefer(try .init(configuration: .clientDefault)))
  ), as: .psql)
  
  
  // Add database migrations
  app.migrations.add(CreateArticle())
  app.migrations.add(SeedArticles())
  
  app.views.use(.leaf)

  try routes(app)
}
