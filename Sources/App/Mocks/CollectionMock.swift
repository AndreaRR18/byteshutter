import Foundation

extension [Collection] {
  static let mock: Self = [
    .init(
      id: .init(),
      name: "Test 1",
      slug: "test_1",
      description: "Test collection number one",
      createdAt: Date()
    ),
    .init(
      id: .init(),
      name: "Test 2",
      slug: "test_2",
      description: "Test collection number two",
      createdAt: Date()
    ),
    .init(
      id: .init(),
      name: "Test 3",
      slug: "test_3",
      description: "Test collection number three",
      createdAt: Date()
    ),
  ]
}
