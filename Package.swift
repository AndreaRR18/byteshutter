// swift-tools-version:6.0
import PackageDescription

let package = Package(
  name: "byteshutter",
  platforms: [
    .macOS(.v13)
  ],
  dependencies: [
    .package(url: "https://github.com/vapor/vapor.git", from: "4.110.1"),
    .package(url: "https://github.com/vapor/leaf.git", from: "4.3.0"),
    .package(url: "https://github.com/apple/swift-nio.git", from: "2.65.0"),
    .package(url: "https://github.com/JohnSundell/Ink.git", from: "0.6.0"),
    .package(path: "SectionsPackage"),
  ],
  targets: [
    .executableTarget(
      name: "App",
      dependencies: [
        .product(name: "Leaf", package: "leaf"),
        .product(name: "Vapor", package: "vapor"),
        .product(name: "NIOCore", package: "swift-nio"),
        .product(name: "NIOPosix", package: "swift-nio"),
        .product(name: "Ink", package: "Ink"),
        .product(name: "Articles", package: "SectionsPackage")
      ],
      swiftSettings: swiftSettings
    ),
    .testTarget(
      name: "AppTests",
      dependencies: [
        .target(name: "App"),
        .product(name: "VaporTesting", package: "vapor"),
      ],
      swiftSettings: swiftSettings
    )
  ],
  swiftLanguageModes: [.v5]
)

var swiftSettings: [SwiftSetting] { [
  .enableUpcomingFeature("DisableOutwardActorInference"),
  .enableExperimentalFeature("StrictConcurrency"),
] }
