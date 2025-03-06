import Fluent
import Vapor

func routes(_ app: Application) throws {
  app.get { req -> View in
    let latestArticles = try await Article.query(on: req.db)
      .sort(\.$createdAt, .descending)
      .limit(3)
      .all()
      .map { $0.toDTO() }
    
    return try await req.view.render(
      "index",
      IndexContext(
        title: "ByteShutter",
        articles: latestArticles
      )
    )
  }
  
  app.get("about") { req -> View in
    return try await req.view.render("about")
  }
  
  try app.register(collection: ArticleController())
  
  try app.register(collection: ContactController())
}

struct IndexContext: Encodable {
    let title: String
    let articles: [ArticleDTO]
}
