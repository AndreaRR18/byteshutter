import Fluent
import Foundation

final class ArticlesCollections: Model, @unchecked Sendable {
  static let schema = "articles_collections"
  
  @ID(key: .id)
  var id: UUID?
  
  @Field(key: "article_id")
  var articleID: UUID
  
  @Field(key: "collection_id")
  var collectionID: UUID
  
  init() {}
  
  init(
    id: UUID?,
    articleID: UUID,
    collectionID: UUID
  ) {
    self.id = id
    self.articleID = articleID
    self.collectionID = collectionID
  }
}
