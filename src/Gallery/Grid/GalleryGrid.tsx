import React from 'react';
import styles from './Gallery.module.css';
import { GalleryItem } from './GalleryItem';
import { useGalleryImages } from '../GalleryUtils';

const Gallery: React.FC = () => {
  const images = useGalleryImages();

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.galleryContent}>
        {images.map((image, index) => (
          <GalleryItem
            key={index}
            src={image.src}
            alt={image.alt}
            title={image.title}
            description={image.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;