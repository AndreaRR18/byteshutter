import Testing
@testable import Articles

@Suite
struct FooTests {
  @Test func fooInitialization() {
    let sut = Foo()
    #expect(sut.number == 42)
  }
}
