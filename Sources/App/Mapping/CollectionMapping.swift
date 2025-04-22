enum CollectionMapping {
  static func toDTO(from collection: Collection) -> CollectionDTO {
    CollectionDTO(
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      createdAt: collection.createdAt
    )
  }
  
  static func toModel(from collectionDTO: CollectionDTO) -> Collection {
    Collection(
      id: collectionDTO.id,
      name: collectionDTO.name,
      slug: collectionDTO.slug,
      description: collectionDTO.description,
      createdAt: collectionDTO.createdAt
    )
  }
}
