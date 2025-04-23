import Vapor

struct AboutController: RouteCollection, Sendable {
  func boot(routes: any RoutesBuilder) throws {
    let about = routes.grouped("about")
    about.get(use: index)
  }
  
  @Sendable
  func index(req: Request) async throws -> View {
    return try await req.view.render("about")
  }
}
