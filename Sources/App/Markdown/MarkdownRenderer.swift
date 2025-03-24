import Foundation

/// A lightweight Markdown to HTML renderer for Vapor applications
public struct MarkdownRenderer {
  /// Rendering options to customize the markdown conversion
  public struct Options: Sendable {
    /// Whether to sanitize the HTML output to prevent XSS attacks
    public var sanitize: Bool
    
    /// Whether to parse and render code blocks with syntax highlighting
    public var enableCodeHighlighting: Bool
    
    /// Whether to render emojis from markdown shortcodes (e.g., :smile:)
    public var enableEmojis: Bool
    
    /// Creates a new Options instance with default values
    public init(
      sanitize: Bool = true,
      enableCodeHighlighting: Bool = true,
      enableEmojis: Bool = true
    ) {
      self.sanitize = sanitize
      self.enableCodeHighlighting = enableCodeHighlighting
      self.enableEmojis = enableEmojis
    }
    
    /// Default options with sensible defaults
    public static let `default` = Options()
  }
  
  /// The options used for rendering
  private let options: Options
  
  /// Initializes a new markdown renderer with the specified options
  /// - Parameter options: The options to use for rendering
  public init(options: Options = .default) {
    self.options = options
  }
  
  /// Renders markdown text to HTML
  /// - Parameter markdownText: The markdown text to render
  /// - Returns: The rendered HTML
  public func renderHTML(from markdownText: String) -> String {
    var html = renderMarkdownToHTML(markdownText)
    
    if options.sanitize {
      html = sanitizeHTML(html)
    }
    
    return html
  }
  
  // MARK: - Private Methods
  
  /// Core markdown to HTML rendering logic
  private func renderMarkdownToHTML(_ markdown: String) -> String {
    var html = markdown
    
    // Process headings (# Heading 1, ## Heading 2, etc.)
    html = processHeadings(html)
    
    // Process paragraphs
    html = processParagraphs(html)
    
    // Process bold text (**bold**)
    html = processBoldText(html)
    
    // Process italic text (*italic*)
    html = processItalicText(html)
    
    // Process inline code (`code`)
    html = processInlineCode(html)
    
    // Process code blocks (```code```)
    html = processCodeBlocks(html)
    
    // Process unordered lists
    html = processUnorderedLists(html)
    
    // Process ordered lists
    html = processOrderedLists(html)
    
    // Process links ([text](url))
    html = processLinks(html)
    
    // Process images (![alt](url))
    html = processImages(html)
    
    // Process block quotes
    html = processBlockquotes(html)
    
    // Process horizontal rules
    html = processHorizontalRules(html)
    
    if options.enableEmojis {
      html = processEmojis(html)
    }
    
    return html
  }
  
  /// Process headings (# Heading 1, ## Heading 2, etc.)
  private func processHeadings(_ text: String) -> String {
    var processed = text
    
    // Process section headers first (Key Concepts, Routes, Models, Next Steps)
    let sectionHeaderPattern = "^(Key Concepts|Routes|Models|Next Steps)$"
    let sectionRegex = try? NSRegularExpression(pattern: sectionHeaderPattern, options: [.anchorsMatchLines])
    
    processed = sectionRegex?.stringByReplacingMatches(
      in: processed,
      options: [],
      range: NSRange(processed.startIndex..., in: processed),
      withTemplate: "<h2 class=\"section-header\">$1</h2>"
    ) ?? processed
    
    // Match headings (# Heading 1, ## Heading 2, etc.)
    for i in (1...6).reversed() {
      let pattern = "^#{1,\(i)}\\s+(.+)$"
      let regex = try? NSRegularExpression(pattern: pattern, options: [.anchorsMatchLines])
      
      processed = regex?.stringByReplacingMatches(
        in: processed,
        options: [],
        range: NSRange(processed.startIndex..., in: processed),
        withTemplate: "<h\(i)>$1</h\(i)>"
      ) ?? processed
    }
    
    return processed
  }
  
  /// Process paragraphs
  private func processParagraphs(_ text: String) -> String {
    // Split by double newlines
    let paragraphs = text.components(separatedBy: "\n\n")
    
    // Skip wrapping certain elements in <p> tags
    let wrappedParagraphs = paragraphs.map { paragraph -> String in
      let trimmed = paragraph.trimmingCharacters(in: .whitespacesAndNewlines)
      
      // Don't wrap headings, lists, code blocks, etc.
      if trimmed.isEmpty ||
          trimmed.hasPrefix("<h") ||
          trimmed.hasPrefix("<ul") ||
          trimmed.hasPrefix("<ol") ||
          trimmed.hasPrefix("<pre") ||
          trimmed.hasPrefix("<blockquote") {
        return trimmed
      }
      
      return "<p>\(trimmed)</p>"
    }
    
    return wrappedParagraphs.joined(separator: "\n\n")
  }
  
  /// Process bold text (**bold**)
  private func processBoldText(_ text: String) -> String {
    // Match **bold text** or __bold text__
    let pattern = "\\*\\*(.+?)\\*\\*|__(.+?)__"
    let regex = try? NSRegularExpression(pattern: pattern, options: [])
    
    return regex?.stringByReplacingMatches(
      in: text,
      options: [],
      range: NSRange(text.startIndex..., in: text),
      withTemplate: "<strong>$1$2</strong>"
    ) ?? text
  }
  
  /// Process italic text (*italic*)
  private func processItalicText(_ text: String) -> String {
    // Match *italic text* or _italic text_
    let pattern = "\\*([^\\*]+?)\\*|_([^_]+?)_"
    let regex = try? NSRegularExpression(pattern: pattern, options: [])
    
    return regex?.stringByReplacingMatches(
      in: text,
      options: [],
      range: NSRange(text.startIndex..., in: text),
      withTemplate: "<em>$1$2</em>"
    ) ?? text
  }
  
  /// Process inline code (`code`)
  private func processInlineCode(_ text: String) -> String {
    // Match `inline code`
    let pattern = "`([^`]+?)`"
    let regex = try? NSRegularExpression(pattern: pattern, options: [])
    
    return regex?.stringByReplacingMatches(
      in: text,
      options: [],
      range: NSRange(text.startIndex..., in: text),
      withTemplate: "<code>$1</code>"
    ) ?? text
  }
  
  /// Process code blocks (```code```)
  private func processCodeBlocks(_ text: String) -> String {
    var processed = text
    
    // Match ```language\ncode\n```
    let pattern = "```([a-zA-Z]*)\\s*\\n([\\s\\S]*?)\\n```"
    let regex = try? NSRegularExpression(pattern: pattern, options: [])
    
    if let matches = regex?.matches(
      in: processed,
      options: [],
      range: NSRange(processed.startIndex..., in: processed)
    ) {
      for match in matches.reversed() {
        guard let range = Range(match.range, in: processed) else { continue }
        
        let fullMatch = String(processed[range])
        
        // Extract language and code content
        if match.numberOfRanges >= 3,
           let languageRange = Range(match.range(at: 1), in: processed),
           let codeRange = Range(match.range(at: 2), in: processed) {
          
          let language = processed[languageRange]
          let code = processed[codeRange]
          
          var languageClass = "language-\(language)"
          if language.isEmpty {
            languageClass = "language-none"
          }
          
          var replacement = "<pre class=\"code-block\">"
          replacement += "<code class=\"\(languageClass)\">"
          
          // Escape HTML in code blocks
          let escapedCode = escapeHTML(String(code))
          replacement += escapedCode
          replacement += "</code></pre>"
          
          processed = processed.replacingOccurrences(of: fullMatch, with: replacement)
        }
      }
    }
    
    return processed
  }
  
  /// Process unordered lists
  private func processUnorderedLists(_ text: String) -> String {
    // Find potential list blocks
    let listBlocks = extractListBlocks(from: text)
    var processed = text
    
    for block in listBlocks {
      // Check if it's an unordered list (starts with - or * or +)
      if block.contains(where: { line in
        let trimmed = line.trimmingCharacters(in: .whitespacesAndNewlines)
        return trimmed.hasPrefix("- ") || trimmed.hasPrefix("* ") || trimmed.hasPrefix("+ ")
      }) {
        let listItems = block.map { line -> String in
          let trimmed = line.trimmingCharacters(in: .whitespacesAndNewlines)
          if trimmed.hasPrefix("- ") || trimmed.hasPrefix("* ") || trimmed.hasPrefix("+ ") {
            let itemContent = String(trimmed.dropFirst(2))
            return "<li>\(itemContent)</li>"
          }
          return line
        }
        
        let htmlList = "<ul>\n\(listItems.joined(separator: "\n"))\n</ul>"
        processed = processed.replacingOccurrences(of: block.joined(separator: "\n"), with: htmlList)
      }
    }
    
    return processed
  }
  
  /// Process ordered lists
  private func processOrderedLists(_ text: String) -> String {
    // Find potential list blocks
    let listBlocks = extractListBlocks(from: text)
    var processed = text
    
    for block in listBlocks {
      // Check if it's an ordered list (starts with 1. 2. etc)
      if block.contains(where: { line in
        let trimmed = line.trimmingCharacters(in: .whitespacesAndNewlines)
        return trimmed.range(of: "^\\d+\\.\\s", options: .regularExpression) != nil
      }) {
        let listItems = block.map { line -> String in
          let trimmed = line.trimmingCharacters(in: .whitespacesAndNewlines)
          if let range = trimmed.range(of: "^\\d+\\.\\s", options: .regularExpression) {
            let itemContent = String(trimmed[range.upperBound...])
            return "<li>\(itemContent)</li>"
          }
          return line
        }
        
        let htmlList = "<ol>\n\(listItems.joined(separator: "\n"))\n</ol>"
        processed = processed.replacingOccurrences(of: block.joined(separator: "\n"), with: htmlList)
      }
    }
    
    return processed
  }
  
  /// Helper to extract list blocks from text
  private func extractListBlocks(from text: String) -> [[String]] {
    let lines = text.components(separatedBy: "\n")
    var listBlocks: [[String]] = []
    var currentBlock: [String] = []
    
    for line in lines {
      let trimmed = line.trimmingCharacters(in: .whitespacesAndNewlines)
      let isListItem = trimmed.hasPrefix("- ") ||
      trimmed.hasPrefix("* ") ||
      trimmed.hasPrefix("+ ") ||
      trimmed.range(of: "^\\d+\\.\\s", options: .regularExpression) != nil
      
      if isListItem {
        // Start a new block if one isn't already in progress
        if currentBlock.isEmpty {
          currentBlock.append(line)
        } else {
          // Check if the previous line was also a list item
          let prevLine = currentBlock.last!
          let prevTrimmed = prevLine.trimmingCharacters(in: .whitespacesAndNewlines)
          let prevIsListItem = prevTrimmed.hasPrefix("- ") ||
          prevTrimmed.hasPrefix("* ") ||
          prevTrimmed.hasPrefix("+ ") ||
          prevTrimmed.range(of: "^\\d+\\.\\s", options: .regularExpression) != nil
          
          if prevIsListItem {
            currentBlock.append(line)
          } else {
            // Save the current block and start a new one
            if !currentBlock.isEmpty {
              listBlocks.append(currentBlock)
            }
            currentBlock = [line]
          }
        }
      } else if trimmed.isEmpty && !currentBlock.isEmpty {
        // Empty line ends the current block
        listBlocks.append(currentBlock)
        currentBlock = []
      } else if !currentBlock.isEmpty {
        // Non-list item ends the current block
        listBlocks.append(currentBlock)
        currentBlock = []
      }
    }
    
    // Don't forget the last block if there is one
    if !currentBlock.isEmpty {
      listBlocks.append(currentBlock)
    }
    
    return listBlocks
  }
  
  /// Process links ([text](url))
  private func processLinks(_ text: String) -> String {
    // Match [text](url)
    let pattern = "\\[([^\\]]+)\\]\\(([^\\)]+)\\)"
    let regex = try? NSRegularExpression(pattern: pattern, options: [])
    
    return regex?.stringByReplacingMatches(
      in: text,
      options: [],
      range: NSRange(text.startIndex..., in: text),
      withTemplate: "<a href=\"$2\">$1</a>"
    ) ?? text
  }
  
  /// Process images (![alt](url))
  private func processImages(_ text: String) -> String {
    // Match ![alt](url)
    let pattern = "!\\[([^\\]]+)\\]\\(([^\\)]+)\\)"
    let regex = try? NSRegularExpression(pattern: pattern, options: [])
    
    return regex?.stringByReplacingMatches(
      in: text,
      options: [],
      range: NSRange(text.startIndex..., in: text),
      withTemplate: "<img src=\"$2\" alt=\"$1\">"
    ) ?? text
  }
  
  /// Process blockquotes
  private func processBlockquotes(_ text: String) -> String {
    let lines = text.components(separatedBy: "\n")
    var inBlockquote = false
    var blockquoteContent: [String] = []
    var result: [String] = []
    
    for (index, line) in lines.enumerated() {
      let trimmed = line.trimmingCharacters(in: .whitespacesAndNewlines)
      
      if trimmed.hasPrefix(">") {
        if !inBlockquote {
          inBlockquote = true
        }
        
        // Remove '>' and add content
        let content = String(trimmed.dropFirst()).trimmingCharacters(in: .whitespaces)
        blockquoteContent.append(content)
      } else if inBlockquote && trimmed.isEmpty {
        // End of blockquote
        if !blockquoteContent.isEmpty {
          let blockquote = "<blockquote>\(blockquoteContent.joined(separator: "<br>"))</blockquote>"
          result.append(blockquote)
          blockquoteContent = []
          inBlockquote = false
        }
        // Add the empty line
        result.append(line)
      } else if inBlockquote {
        // End of blockquote
        if !blockquoteContent.isEmpty {
          let blockquote = "<blockquote>\(blockquoteContent.joined(separator: "<br>"))</blockquote>"
          result.append(blockquote)
          blockquoteContent = []
          inBlockquote = false
        }
        // Add the current line
        result.append(line)
      } else {
        // Not in a blockquote, add the line as is
        result.append(line)
      }
      
      // Handle the last line if it's part of a blockquote
      if inBlockquote && index == lines.count - 1 {
        let blockquote = "<blockquote>\(blockquoteContent.joined(separator: "<br>"))</blockquote>"
        result.append(blockquote)
      }
    }
    
    return result.joined(separator: "\n")
  }
  
  /// Process horizontal rules (---, ***, ___)
  private func processHorizontalRules(_ text: String) -> String {
    var processed = text
    
    // Match ---, ***, ___
    let patterns = ["^---+$", "^\\*\\*\\*+$", "^___+$"]
    
    for pattern in patterns {
      let regex = try? NSRegularExpression(pattern: pattern, options: [.anchorsMatchLines])
      processed = regex?.stringByReplacingMatches(
        in: processed,
        options: [],
        range: NSRange(processed.startIndex..., in: processed),
        withTemplate: "<hr>"
      ) ?? processed
    }
    
    return processed
  }
  
  /// Process emoji shortcodes
  private func processEmojis(_ text: String) -> String {
    // A simple emoji map - in a real implementation, this would be much more extensive
    let emojiMap: [String: String] = [
      ":smile:": "😊",
      ":laughing:": "😂",
      ":thumbsup:": "👍",
      ":thumbsdown:": "👎",
      ":heart:": "❤️",
      ":star:": "⭐",
      ":check:": "✅",
      ":x:": "❌"
    ]
    
    var result = text
    
    for (shortcode, emoji) in emojiMap {
      result = result.replacingOccurrences(of: shortcode, with: emoji)
    }
    
    return result
  }
  
  /// Sanitize HTML to prevent XSS attacks
  private func sanitizeHTML(_ html: String) -> String {
    // This is a very basic implementation
    // In production, you would use a more comprehensive sanitizer
    
    // Replace known dangerous patterns
    var sanitized = html
    
    // Remove script tags and their content
    let scriptPattern = "<script[^>]*>[\\s\\S]*?</script>"
    if let regex = try? NSRegularExpression(pattern: scriptPattern, options: []) {
      sanitized = regex.stringByReplacingMatches(
        in: sanitized,
        options: [],
        range: NSRange(sanitized.startIndex..., in: sanitized),
        withTemplate: ""
      )
    }
    
    // Remove on* attributes (onclick, onmouseover, etc.)
    let onAttributePattern = " on[a-z]+=\"[^\"]*\""
    if let regex = try? NSRegularExpression(pattern: onAttributePattern, options: []) {
      sanitized = regex.stringByReplacingMatches(
        in: sanitized,
        options: [],
        range: NSRange(sanitized.startIndex..., in: sanitized),
        withTemplate: ""
      )
    }
    
    return sanitized
  }
  
  /// Escape HTML entities in text
  private func escapeHTML(_ text: String) -> String {
    return text
      .replacingOccurrences(of: "&", with: "&amp;")
      .replacingOccurrences(of: "<", with: "&lt;")
      .replacingOccurrences(of: ">", with: "&gt;")
      .replacingOccurrences(of: "\"", with: "&quot;")
      .replacingOccurrences(of: "'", with: "&#39;")
  }
}

// Add this to your MarkdownRenderer.swift file

extension MarkdownRenderer {
    /// Process Swift code blocks with better syntax highlighting classes
    private func enhanceSwiftCodeBlocks(_ html: String) -> String {
        var enhancedHtml = html
        
        // Find all Swift code blocks
        let pattern = "<pre><code class=\"language-swift\">(.*?)</code></pre>"
        let regex = try? NSRegularExpression(pattern: pattern, options: [.dotMatchesLineSeparators])
        
        if let matches = regex?.matches(
            in: enhancedHtml,
            options: [],
            range: NSRange(enhancedHtml.startIndex..., in: enhancedHtml)
        ) {
            for match in matches.reversed() {
                if match.numberOfRanges >= 2,
                   let codeRange = Range(match.range(at: 1), in: enhancedHtml) {
                    
                    let code = enhancedHtml[codeRange]
                    
                    // Add Swift-specific syntax highlighting classes
                    // This is a simplified example - a real implementation would be more comprehensive
                    let enhancedCode = String(code)
                        .replacingOccurrences(of: "func ", with: "<span class=\"hljs-keyword\">func </span>")
                        .replacingOccurrences(of: "class ", with: "<span class=\"hljs-keyword\">class </span>")
                        .replacingOccurrences(of: "struct ", with: "<span class=\"hljs-keyword\">struct </span>")
                        .replacingOccurrences(of: "enum ", with: "<span class=\"hljs-keyword\">enum </span>")
                        .replacingOccurrences(of: "var ", with: "<span class=\"hljs-keyword\">var </span>")
                        .replacingOccurrences(of: "let ", with: "<span class=\"hljs-keyword\">let </span>")
                    
                    let fullMatch = match.range(at: 0)
                    if let fullRange = Range(fullMatch, in: enhancedHtml) {
                        let replacement = "<pre><code class=\"language-swift\">\(enhancedCode)</code></pre>"
                      enhancedHtml = enhancedHtml.replacingCharacters(in: fullRange, with: replacement)
                    }
                }
            }
        }
        
        return enhancedHtml
    }
}
