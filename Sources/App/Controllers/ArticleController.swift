import Vapor
import Ink
import Foundation

/// Controller responsible for handling article-related routes and actions.
/// Provides functionality for listing, viewing, and creating articles.
struct ArticleController: RouteCollection, Sendable {
    private let articleService: ArticleService
    
    /// Initialize with a custom ArticleService (useful for testing)
    /// - Parameter articleService: The ArticleService to use
    init(articleService: ArticleService) {
        self.articleService = articleService
    }
    
    /// Registers all routes related to articles with the application.
    /// - Parameter routes: The routes builder to register the routes with.
    /// - Throws: An error if route registration fails.
    func boot(routes: RoutesBuilder) throws {
        // Register root path
        routes.get(use: index)
        
        // Register /articles routes
        let articles = routes.grouped("articles")
        articles.get(":slug", use: show)
    }
    
    /// Returns a view displaying all articles sorted by update date.
    /// - Parameter req: The incoming request.
    /// - Returns: A rendered view containing the list of articles.
    /// - Throws: An error if file operations or view rendering fails.
    @Sendable
    func index(req: Request) async throws -> View {
        let articles = try await articleService.getAllArticles()
            .filter { $0.isPublished }
        
        return try await req.view.render(
            "index",
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
        
        guard let article = try await articleService.getArticle(bySlug: slug) else {
            throw Abort(.notFound)
        }
        
        // Convert markdown content to HTML for display
        var articleWithHTML = article
        articleWithHTML.content = MarkdownParser().parse(article.content).html
        
        return try await req.view.render(
            "article",
            ["article": articleWithHTML]
        )
    }
}
