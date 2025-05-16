import Fluent
import Vapor
import Foundation

/// Data Transfer Object (DTO) for Article entities.
/// Used for transferring article data between the application layers and API.
/// Separates database concerns from API/frontend representation.
struct ArticleDTO: Content, Sendable, Equatable {
  /// Unique identifier for the article
  var id: UUID?
  
  /// URL-friendly version of the title used for routing
  var slug: String
  
  /// Title of the article
  var title: String
  
  /// Short summary or preview of the article content
  var excerpt: String
  
  /// Full content of the article (in Markdown format)
  var content: String
  
  /// Date when the article was or will be published
  var publicationDate: Date
  
  /// Flag indicating whether the article is published and visible to readers
  var isPublished: Bool
  
  /// Array of topic tags associated with the article
  var topics: [String]
  
  /// Timestamp when the article was created
  var createdAt: Date?
  
  /// Timestamp when the article was last updated
  var updatedAt: Date?
}
