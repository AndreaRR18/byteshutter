// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "StaticSiteGenerator",
    platforms: [.macOS(.v13)],
    dependencies: [
        .package(url: "https://github.com/vapor/vapor.git", from: "4.0.0"),
        .package(url: "https://github.com/vapor/leaf.git", from: "4.0.0"),
        .package(path: "..")  // Reference to the main package
    ],
    targets: [
        .executableTarget(
            name: "generate_static_site",
            dependencies: [
                .product(name: "Vapor", package: "vapor"),
                .product(name: "Leaf", package: "leaf"),
                .product(name: "App", package: "byteshutter")
            ],
            path: "."
        )
    ]
)
