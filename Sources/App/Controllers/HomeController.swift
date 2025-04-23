import Vapor
import Ink

struct HomeController: RouteCollection, Sendable {
  func boot(routes: any RoutesBuilder) throws {
    routes.get(use: show)
  }
  
  @Sendable
  func show(req: Request) async throws -> View {
    return try await req.view.render(
      "index",
      IndexContext()
    )
  }
}

struct IndexContext: Encodable {
  let introduction: String = MarkdownParser().parse(
        """
        # Introduction for Andrea Rinaldi
        
        Hello, I'm Andrea Rinaldi, an experienced iOS Engineer with a strong technical background and a passion for photography. Based in Milan, I've built my career as a remote worker, collaborating with diverse teams and contributing to the success of renowned companies like Facile.it and Jobandtalent.
        
        My expertise lies in my deep understanding of iOS development, with a particular focus on algorithms, code refactoring, and the App Store ecosystem. I have honed my skills in SwiftUI, enabling me to create intuitive and efficient user interfaces. My analytical skills and proficiency in debugging have been instrumental in solving complex technical challenges and optimizing app performance.
        
        With a background that includes roles as a web graphic designer and accounting auditor, I bring a unique blend of creativity and precision to my work. My enthusiasm for photography drives my innovative approach to problem-solving and continuous learning. Whether I'm refining algorithms, optimizing code, or capturing the perfect shot, my dedication and technical expertise are evident in everything I do.
        """
  ).html
}
