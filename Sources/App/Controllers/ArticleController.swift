import Fluent
import Vapor
import Ink

struct ArticleController: RouteCollection, Sendable {
  func boot(routes: RoutesBuilder) throws {
    let articles = routes.grouped("articles")
    
    articles.get(use: index)
    articles.get(":slug", use: show)
    articles.post("create", use: createArticle)
  }
  
  @Sendable
  func index(req: Request) async throws -> View {
    let articles = try await Article.query(on: req.db)
      .sort(\.$updatedAt, .descending)
      .all()
      .map { ArticleMapping.toDTO(from: $0) }
    
    return try await req.view.render(
      "articles",
      ["articles": articles]
    )
  }
  
  @Sendable
  func show(req: Request) async throws -> View {
    guard let slug = req.parameters.get("slug") else {
      throw Abort(.badRequest)
    }
    
    guard let article = try await Article.query(on: req.db)
      .filter(\.$slug == slug)
      .first() else {
      throw Abort(.notFound)
    }
    
    article.content = MarkdownParser().parse(article.content).html
    
    return try await req.view.render(
      "article",
      ["article": article]
    )
  }
  
  @Sendable
  func createArticle(req: Request) async throws -> Article {
    let article = try req.content.decode(Article.self)
    try await article.save(on: req.db)
    return article
  }
}
