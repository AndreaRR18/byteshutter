import Foundation
import Vapor
import Leaf

// Configure the application for static site generation
let app = Application(.production)

do {
    // Configure the application
    try configure(app)
    
    // Set up the public directory for static files
    let publicDir = app.directory.publicDirectory
    let outputDir = publicDir.appending("static-site/")
    
    // Create the output directory if it doesn't exist
    try FileManager.default.createDirectory(atPath: outputDir, withIntermediateDirectories: true)
    
    // Define the routes to export
    let routesToExport = [
        "/",
        "/about",
        "/articles",
        // Add more routes as needed
    ]
    
    // Create an HTTP client to fetch each route
    let client = app.client
    
    // Function to save a route's HTML to a file
    func saveRoute(_ path: String) async throws {
        let url = "http://localhost:8080\(path)"
        let response = try await client.get(URI(string: url))
        
        guard let body = response.body else {
            throw Abort(.internalServerError, reason: "No response body for \(path)")
        }
        
        let outputPath = outputDir.appending(path == "/" ? "index.html" : "\(path)/index.html")
        let outputURL = URL(fileURLWithPath: outputPath)
        
        // Create parent directories if they don't exist
        try FileManager.default.createDirectory(
            at: outputURL.deletingLastPathComponent(),
            withIntermediateDirectories: true
        )
        
        // Write the file
        try Data(buffer: body).write(to: outputURL)
        print("Generated: \(path)")
    }
    
    // Start the application
    try app.server.start(address: .hostname("localhost", port: 8080))
    
    // Export each route
    for route in routesToExport {
        try await saveRoute(route)
    }
    
    // Copy public files
    let publicFiles = try FileManager.default.contentsOfDirectory(atPath: publicDir)
    for file in publicFiles where !file.hasPrefix(".") && file != "static-site" {
        let source = URL(fileURLWithPath: publicDir).appendingPathComponent(file)
        let destination = URL(fileURLWithPath: outputDir).appendingPathComponent(file)
        
        if FileManager.default.fileExists(atPath: source.path) {
            if FileManager.default.fileExists(atPath: destination.path) {
                try FileManager.default.removeItem(at: destination)
            }
            try FileManager.default.copyItem(at: source, to: destination)
            print("Copied: \(file)")
        }
    }
    
    print("\nStatic site generation complete!")
    print("Output directory: \(outputDir)")
    
    // Shut down the application
    app.shutdown()
    exit(0)
    
} catch {
    print("Error: \(error)")
    app.shutdown()
    exit(1)
}
