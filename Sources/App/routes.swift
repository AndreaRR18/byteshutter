import Fluent
import Vapor

func routes(_ app: Application) throws {
  app.get { req -> View in
    // Get the latest articles for our landing page
    let latestArticles = try await Article.query(on: req.db)
      .sort(\.$createdAt, .descending)
      .limit(3)
      .all()
      .map { $0.toDTO() }
    
    // Pass the articles to the template
    return try await req.view.render(
      "index",
      IndexContext(
        title: "ByteShutter",
        articles: latestArticles
      )
    )
  }
  
  // Register the Article controller
  try app.register(collection: ArticleController())
}

struct IndexContext: Encodable {
    let title: String
    let articles: [ArticleDTO]
}
