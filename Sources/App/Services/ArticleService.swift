import Foundation
import Ink
import Vapor

/// Service responsible for managing articles stored in the file system
struct ArticleService: Sendable {
    private let fileManager: FileManager
    private let articlesDirectory: URL
    
    /// Initializes the ArticleService with a file manager and base directory
    /// - Parameters:
    ///   - fileManager: The file manager to use (default: .default)
    ///   - directory: The base directory where articles are stored (default: Resources/Articles)
    init(fileManager: FileManager = .default, directory: URL? = nil) {
        self.fileManager = fileManager
        
        if let directory = directory {
            self.articlesDirectory = directory
        } else {
            // Default to Resources/Articles in the current working directory
            let workingDirectory = URL(fileURLWithPath: fileManager.currentDirectoryPath)
            self.articlesDirectory = workingDirectory
                .appendingPathComponent("articles")
        }
        
        // Create articles directory if it doesn't exist
        try? fileManager.createDirectory(at: articlesDirectory, withIntermediateDirectories: true)
    }
    
    /// Fetches all articles from the file system
    /// - Returns: An array of articles
    /// - Throws: Errors that occur during file reading or parsing
    func getAllArticles() throws -> [Article] {
        guard fileManager.fileExists(atPath: articlesDirectory.path) else {
            return []
        }
        
        let articleFiles = try fileManager.contentsOfDirectory(
            at: articlesDirectory,
            includingPropertiesForKeys: [.contentModificationDateKey],
            options: [.skipsHiddenFiles]
        )
        
        return try articleFiles
            .filter { $0.pathExtension == "md" }
            .compactMap { url -> Article? in
                let attributes = try fileManager.attributesOfItem(atPath: url.path)
                guard let modificationDate = attributes[.modificationDate] as? Date else {
                    return nil
                }
                
                let content = try String(contentsOf: url, encoding: .utf8)
                let (metadata, markdown) = extractMetadata(from: content)
                
                let slug = url.deletingPathExtension().lastPathComponent
                
                return Article(
                    id: nil,
                    title: metadata["title"] ?? slug.replacingOccurrences(of: "-", with: " ").capitalized,
                    excerpt: metadata["excerpt"] ?? "",
                    slug: slug,
                    content: markdown,
                    publicationDate: modificationDate,
                    isPublished: metadata["published"]?.lowercased() != "false",
                    topics: metadata["topics"]?.components(separatedBy: ",").map { $0.trimmingCharacters(in: .whitespaces) } ?? []
                )
            }
            .sorted { $0.publicationDate > $1.publicationDate }
    }
    
    /// Fetches a single article by its slug
    /// - Parameter slug: The slug of the article to fetch
    /// - Returns: The article if found, nil otherwise
    /// - Throws: Errors that occur during file reading or parsing
    func getArticle(bySlug slug: String) throws -> Article? {
        let fileURL = articlesDirectory.appendingPathComponent("\(slug).md")
        guard fileManager.fileExists(atPath: fileURL.path) else {
            return nil
        }
        
        let content = try String(contentsOf: fileURL, encoding: .utf8)
        let (metadata, markdown) = extractMetadata(from: content)
        
        let attributes = try fileManager.attributesOfItem(atPath: fileURL.path)
        let modificationDate = (attributes[.modificationDate] as? Date) ?? Date()
        
        return Article(
            id: nil,
            title: metadata["title"] ?? slug.replacingOccurrences(of: "-", with: " ").capitalized,
            excerpt: metadata["excerpt"] ?? "",
            slug: slug,
            content: markdown,
            publicationDate: modificationDate,
            isPublished: metadata["published"]?.lowercased() != "false",
            topics: metadata["topics"]?.components(separatedBy: ",").map { $0.trimmingCharacters(in: .whitespaces) } ?? []
        )
    }
    
    /// Extracts metadata from the content of a markdown file
    /// - Parameter content: The content of the markdown file
    /// - Returns: A tuple containing the metadata dictionary and the remaining markdown content
    private func extractMetadata(from content: String) -> ([String: String], String) {
        var metadata: [String: String] = [:]
        let lines = content.components(separatedBy: .newlines)
        var markdownLines = [String]()
        
        var inMetadata = false
        
        for line in lines {
            if line == "---" {
                if inMetadata {
                    inMetadata = false
                    continue
                } else if markdownLines.isEmpty {
                    inMetadata = true
                    continue
                }
            }
            
            if inMetadata {
                let parts = line.components(separatedBy: ":")
                if parts.count >= 2 {
                    let key = parts[0].trimmingCharacters(in: .whitespaces)
                    let value = parts.dropFirst().joined(separator: ":").trimmingCharacters(in: .whitespaces)
                    metadata[key] = value
                }
            } else {
                markdownLines.append(line)
            }
        }
        
        return (metadata, markdownLines.joined(separator: "\n"))
    }
}

// MARK: - Async/Await Wrappers
extension ArticleService {
    func getAllArticles() async throws -> [Article] {
        try await withCheckedThrowingContinuation { continuation in
            do {
                let articles = try getAllArticles()
                continuation.resume(returning: articles)
            } catch {
                continuation.resume(throwing: error)
            }
        }
    }
    
    func getArticle(bySlug slug: String) async throws -> Article? {
        try await withCheckedThrowingContinuation { continuation in
            do {
                let article = try getArticle(bySlug: slug)
                continuation.resume(returning: article)
            } catch {
                continuation.resume(throwing: error)
            }
        }
    }
}
