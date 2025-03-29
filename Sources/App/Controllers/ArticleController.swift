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
      .map { $0.toDTO() }
    
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
    
    return try await req.view.render(
      "article",
      ["article": Article(
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        content: MarkdownParser().parse(article.content).html,
        slug: article.slug
      )]
    )
  }
  
  @Sendable
  func adminIndex(req: Request) async throws -> [ArticleDTO] {
    try await Article.query(on: req.db).all().map { $0.toDTO() }
  }
  
  @Sendable
  func create(req: Request) async throws -> ArticleDTO {
    let articleDTO = try req.content.decode(ArticleDTO.self)
    let article = articleDTO.toModel()
    
    try await article.save(on: req.db)
    return article.toDTO()
  }
  
  @Sendable
  func update(req: Request) async throws -> ArticleDTO {
    guard let article = try await Article.find(req.parameters.get("articleID"), on: req.db) else {
      throw Abort(.notFound)
    }
    
    let updated = try req.content.decode(ArticleDTO.self)
    
    article.title = updated.title
    article.excerpt = updated.excerpt
    article.content = updated.content
    article.slug = updated.slug
    
    try await article.save(on: req.db)
    return article.toDTO()
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
