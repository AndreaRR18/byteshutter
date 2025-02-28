import Vapor
import FluentPostgresDriver

/// A helper for accessing environment variables in a type-safe way
enum AppEnvironment {
  /// Get the database host from environment variables or return a default
  static var hostname: String {
    Environment.get("DATABASE_HOST") ?? "localhost"
  }
  
  /// Get the database port from environment variables or return the default PostgreSQL port
  static var port: Int {
    Environment.get("DATABASE_PORT").flatMap(Int.init) ?? 5432
  }
  
  /// Get the database username from environment variables or return a default
  static var username: String {
    Environment.get("DATABASE_USERNAME") ?? "vapor_username"
  }
  
  /// Get the database password from environment variables or return a default
  static var password: String {
    Environment.get("DATABASE_PASSWORD") ?? "vapor_password"
  }
  
  /// Get the database name from environment variables or return a default
  static var database: String {
    Environment.get("DATABASE_NAME") ?? "vapor_database"
  }
}
