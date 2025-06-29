import React, { useState } from 'react';
import styles from './GalleryGrid.module.css';
import { GalleryItem } from './GalleryItem';
import { useGalleryImages, type GalleryImageWithMetadata } from '../GalleryUtils';
import { ImagePreview } from '../ImagePreview';

const GalleryGrid: React.FC = () => {
  const images = useGalleryImages();
  const [selectedImage, setSelectedImage] = useState<GalleryImageWithMetadata | null>(null);

  const handleImageClick = (image: GalleryImageWithMetadata) => {
    setSelectedImage(image);
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className={styles.galleryContainer}>
        <div className={styles.galleryContent}>
          {images.map((image, index) => (
            <GalleryItem
              key={index}
              image={image}
              onClick={handleImageClick}
            />
          ))}
        </div>
      </div>
      <ImagePreview
        image={selectedImage!}
        isOpen={selectedImage !== null}
        onClose={handleClosePreview}
      />
    </>
  );
};

export default GalleryGrid;