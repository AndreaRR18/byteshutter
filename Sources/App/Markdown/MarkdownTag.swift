import Leaf
import Vapor

/// A Leaf tag that renders markdown content as HTML
public struct MarkdownTag: LeafTag {
  public init() {}
  
  public func render(_ ctx: LeafContext) throws -> LeafData {
    // Ensure we have at least one parameter (the markdown content)
    guard ctx.parameters.count > 0 else {
      throw TemplateKitError("Missing markdown content parameter")
    }
    
    // Get the markdown content from the first parameter
    guard let markdownText = ctx.parameters[0].string else {
      throw TemplateKitError("Markdown content must be a string")
    }
    
    // Set up options from additional parameters
    var options = MarkdownRenderer.Options()
    
    // If we have a second parameter, use it for the sanitize option
    if ctx.parameters.count > 1, let sanitize = ctx.parameters[1].bool {
      options.sanitize = sanitize
    }
    
    // If we have a third parameter, use it for the enableCodeHighlighting option
    if ctx.parameters.count > 2, let enableCodeHighlighting = ctx.parameters[2].bool {
      options.enableCodeHighlighting = enableCodeHighlighting
    }
    
    // If we have a fourth parameter, use it for the enableEmojis option
    if ctx.parameters.count > 3, let enableEmojis = ctx.parameters[3].bool {
      options.enableEmojis = enableEmojis
    }
    
    // Render the markdown to HTML
    let renderer = MarkdownRenderer(options: options)
    let html = renderer.renderHTML(from: markdownText)
    
    // Return the rendered HTML as a LeafData
    return .string(html)
  }
  
  // Custom error type
  private struct TemplateKitError: Error, CustomStringConvertible {
    var description: String
    
    init(_ description: String) {
      self.description = description
    }
  }
}
