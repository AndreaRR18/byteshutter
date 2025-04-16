import Fluent
import Vapor
import Ink

struct ArticleController: RouteCollection, Sendable {
  func boot(routes: RoutesBuilder) throws {
    let articles = routes.grouped("articles")
    
    articles.get(use: index)
    articles.get(":slug", use: show)
    
    let admin = articles.grouped("admin")
    admin.get(use: adminIndex)
    admin.post(use: create)
    admin.group(":articleID") { article in
      article.put(use: update)
      article.delete(use: delete)
    }
  }
  
  @Sendable
  func index(req: Request) async throws -> View {
    let articles = try await Article.query(on: req.db)
      .sort(\.$createdAt, .descending)
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
  func adminIndex(req: Request) async throws -> [ArticleDTO] {
    try await Article.query(on: req.db)
      .all()
      .map { ArticleMapping.toDTO(from: $0) }
  }
  
  @Sendable
  func create(req: Request) async throws -> ArticleDTO {
    let articleDTO = try req.content.decode(ArticleDTO.self)
    try await ArticleMapping.toModel(from: articleDTO)
      .save(on: req.db)
    return articleDTO
  }
  
  @Sendable
  func update(req: Request) async throws -> ArticleDTO {
    guard var article = try await Article.find(req.parameters.get("articleID"), on: req.db) else {
      throw Abort(.notFound)
    }
    
    let updated = try req.content.decode(ArticleDTO.self)
    
    article = ArticleMapping.toModel(from: updated)
    
    try await article.save(on: req.db)
    return ArticleMapping.toDTO(from: article)
  }
  
  @Sendable
  func delete(req: Request) async throws -> HTTPStatus {
    guard let article = try await Article.find(req.parameters.get("articleID"), on: req.db) else {
      throw Abort(.notFound)
    }
    
    try await article.delete(on: req.db)
    return .noContent
  }
}
