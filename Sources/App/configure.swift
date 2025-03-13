import NIOSSL
import Fluent
import FluentPostgresDriver
import Leaf
import Vapor

public func configure(_ app: Application) async throws {
  app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))
  
  app.databases.use(DatabaseConfigurationFactory.postgres(configuration: .init(
    hostname: AppEnvironment.hostname,
    port: AppEnvironment.port,
    username: AppEnvironment.username,
    password: AppEnvironment.password,
    database: AppEnvironment.database,
    tls: .prefer(try .init(configuration: .clientDefault)))
  ), as: .psql)
  
  app.migrations.add(CreateArticle())
  app.migrations.add(SeedArticles())
  
  app.views.use(.leaf)
  
  app.leaf.tags["markdown"] = MarkdownTag()
  
  try routes(app)
}
