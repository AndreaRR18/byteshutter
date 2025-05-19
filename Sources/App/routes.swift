import Fluent
import Vapor

func routes(_ app: Application) throws {
  try app.register(collection: ArticleController())
  try app.register(collection: AboutController())
}
