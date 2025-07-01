import React, { useState } from "react";
import styles from "./GalleryGrid.module.css";
import { GalleryItem } from "./GalleryItem";
import {
  useGalleryImages,
  type GalleryImageWithMetadata,
} from "../GalleryUtils";
import { ImagePreview } from "../ImagePreview";

const GalleryGrid: React.FC = () => {
  const images = useGalleryImages();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  const handleImageClick = (image: GalleryImageWithMetadata) => {
    const index = images.findIndex((img) => img.src === image.src);
    setSelectedImageIndex(index);
  };

  const handleClosePreview = () => {
    setSelectedImageIndex(null);
  };

  const handlePreviousImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  return (
    <>
      <div className={styles.galleryContainer}>
        <div className={styles.galleryContent}>
          {images.map((image, index) => (
            <GalleryItem key={index} image={image} onClick={handleImageClick} />
          ))}
        </div>
      </div>
      {selectedImageIndex !== null && (
        <ImagePreview
          image={images[selectedImageIndex]}
          isOpen={selectedImageIndex !== null}
          onClose={handleClosePreview}
          onPrevious={handlePreviousImage}
          onNext={handleNextImage}
          currentIndex={selectedImageIndex}
          totalImages={images.length}
          hasPrevious={selectedImageIndex > 0}
          hasNext={selectedImageIndex < images.length - 1}
        />
      )}
    </>
  );
};

export default GalleryGrid;
