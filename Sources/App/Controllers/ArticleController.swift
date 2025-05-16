import Fluent
import Vapor
import Ink

/// Controller responsible for handling article-related routes and actions.
/// Provides functionality for listing, viewing, and creating articles.
struct ArticleController: RouteCollection, Sendable {
  /// Registers all routes related to articles with the application.
  /// - Parameter routes: The routes builder to register the routes with.
  /// - Throws: An error if route registration fails.
  func boot(routes: RoutesBuilder) throws {
    let articles = routes.grouped("articles")
    
    articles.get(use: index)
    articles.get(":slug", use: show)
    articles.post("create", use: createArticle)
  }
  
  /// Returns a view displaying all articles sorted by update date.
  /// - Parameter req: The incoming request.
  /// - Returns: A rendered view containing the list of articles.
  /// - Throws: An error if database operations or view rendering fails.
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
  
  /// Returns a view displaying a single article based on its slug.
  /// Renders the article content as HTML from markdown.
  /// - Parameter req: The incoming request containing the article slug.
  /// - Returns: A rendered view containing the article details.
  /// - Throws: BadRequest if slug parameter is missing, NotFound if article doesn't exist.
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
    
    // Convert markdown content to HTML for display
    article.content = MarkdownParser().parse(article.content).html
    
    return try await req.view.render(
      "article",
      ["article": article]
    )
  }
  
  /// Creates a new article in the database.
  /// - Parameter req: The incoming request containing the article data.
  /// - Returns: The created article.
  /// - Throws: An error if decoding the request content or saving to the database fails.
  @Sendable
  func createArticle(req: Request) async throws -> Article {
    let article = try req.content.decode(Article.self)
    try await article.save(on: req.db)
    return article
  }
}
