import Fluent
import Vapor

struct CollectionController: RouteCollection, Sendable {
  func boot(routes: any RoutesBuilder) throws {
    let collections = routes.grouped("collections")
    
    collections.get(use: index)
    collections.get(":slug", use: show)
  }
  
  @Sendable
  func index(req: Request) async throws -> View {
    let collections = try await Collection.query(on: req.db)
      .sort(\.$createdAt, .descending)
      .all()
      .map { CollectionMapping.toDTO(from: $0) }
    
    return try await req.view.render(
      "collections",
      ["collections": collections]
    )
  }
  
  @Sendable
  func show(req: Request) async throws -> View {
    guard let slug = req.parameters.get("slug") else {
      throw Abort(.badRequest)
    }
    
    var collection = try await Collection.query(on: req.db)
      .filter(\.$slug == slug)
      .first()
    
    // Mock
    if collection == nil {
      collection = [Collection].mock.filter {
        $0.slug == slug
      }.first
    }
    
    guard let collectionId = collection?.id else {
      throw Abort(.notFound)
    }
    
    let articlesIDs = try await ArticlesCollections.query(on: req.db)
      .filter( \.$collectionID == collectionId)
      .first()?
      .articleID
      
    
    return try await req.view.render(
      "collection",
      ["collection":collection]
    )
  }
}
