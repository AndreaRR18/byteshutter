// swift-tools-version: 6.1
import PackageDescription

let package = Package(
  name: "SectionsPackage",
  products: [
    .library(
      name: "Articles",
      targets: ["Articles"]
    ),
  ],
  targets: [
    .target(
      name: "Articles"
    ),
    .testTarget(
      name: "ArticlesTests",
      dependencies: ["Articles"]
    ),
  ]
)
