import NIOSSL
import Leaf
import Vapor

public func configure(_ app: Application) async throws {
  app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))
  
  // Configure Leaf for templating
  app.views.use(.leaf)
  
  try routes(app)
}
