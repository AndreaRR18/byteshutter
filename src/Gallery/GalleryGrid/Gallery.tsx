import React, { useState } from "react";
import { galleryPhotos } from "./galleryData";
import type { GalleryPhoto } from "./GalleryItem";
import { PhotoDetail } from "../PhotoDetail/PhotoDetail";
import styles from "./Gallery.module.css";

const Gallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const handlePhotoClick = (photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
  };

  const handleCloseDetail = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.galleryHeader}>
        <h1>Photography Gallery</h1>
        <p>A collection of moments captured through the lens</p>
      </div>

      <div className={styles.galleryGrid}>
        {galleryPhotos.map((photo: GalleryPhoto, index: number) => (
          <div
            key={index}
            className={styles.galleryItem}
            onClick={() => handlePhotoClick(photo)}
          >
            <div className={styles.galleryImageContainer}>
              <img
                src={`/gallery/${photo.imageName}`}
                alt={photo.title}
                className={styles.galleryImage}
                loading="lazy"
              />
            </div>

            <div className={styles.galleryInfo}>
              <h3 className={styles.galleryTitle}>{photo.title}</h3>
              <p className={styles.galleryDescription}>{photo.description}</p>
              <div className={styles.galleryMetadata}>
                <span className={styles.galleryDate}>{photo.creationDate}</span>
                {photo.iso && photo.aperture && photo.exposureTime && (
                  <div className={styles.galleryTechnical}>
                    <span>ISO {photo.iso}</span>
                    <span>{photo.aperture}</span>
                    <span>{photo.exposureTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <PhotoDetail photo={selectedPhoto} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default Gallery;
