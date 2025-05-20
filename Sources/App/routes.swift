import Fluent
import Vapor

func routes(_ app: Application) throws {
  let articleService = ArticleService()
  try app.register(collection: ArticleController(articleService: articleService))
  try app.register(collection: AboutController())
}
