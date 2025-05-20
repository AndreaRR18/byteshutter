import Foundation
import Vapor

/// Article model representing blog articles in the database.
/// Conforms to Model for database operations, Content for encoding/decoding,
/// and Sendable for concurrent use.
final class Article: Content, @unchecked Sendable {
  /// Database table name for this model
  static let schema = "articles"
  
  /// Unique identifier for the article
  var id: UUID?
  
  /// Title of the article
  var title: String
  
  /// Short summary or preview of the article content
  var excerpt: String
  
  /// URL-friendly version of the title used for routing
  var slug: String
  
  /// Full content of the article in Markdown format
  var content: String
  
  /// Date when the article was or will be published
  var publicationDate: Date
  
  /// Flag indicating whether the article is published and visible to readers
  var isPublished: Bool
  
  /// Array of topic tags associated with the article
  var topics: [String]
  
  /// Timestamp when the article was created in the database
  var createdAt: Date?
  
  /// Timestamp when the article was last updated
  var updatedAt: Date?
  
  /// Initializes a new Article with the provided properties
  /// - Parameters:
  ///   - id: Optional UUID identifier
  ///   - title: Article title
  ///   - excerpt: Short summary of the article
  ///   - slug: URL-friendly version of the title
  ///   - content: Full article content in Markdown format
  ///   - publicationDate: Date when the article is/was published
  ///   - isPublished: Whether the article is visible to readers
  ///   - topics: Array of topic tags for categorization
  init(
    id: UUID?,
    title: String,
    excerpt: String,
    slug: String,
    content: String,
    publicationDate: Date,
    isPublished: Bool,
    topics: [String]
  ) {
    self.id = id
    self.title = title
    self.excerpt = excerpt
    self.slug = slug
    self.content = content
    self.publicationDate = publicationDate
    self.isPublished = isPublished
    self.topics = topics
  }
}
