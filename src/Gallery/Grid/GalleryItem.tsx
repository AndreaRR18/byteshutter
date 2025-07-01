import React from "react";
import styles from "./GalleryItem.module.css";
import { type GalleryImageWithMetadata } from "../GalleryUtils";

export interface GalleryItemProps {
  image: GalleryImageWithMetadata;
  onClick: (image: GalleryImageWithMetadata) => void;
}

export const GalleryItem: React.FC<GalleryItemProps> = ({ image, onClick }) => {
  const handleClick = () => {
    onClick(image);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(image);
    }
  };

  return (
    <div
      className={styles.galleryItem}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${image.title || "image"} details`}
    >
      <div className={styles.imageContainer}>
        <img
          src={image.src}
          alt={image.alt}
          className={styles.image}
          loading="lazy"
        />
      </div>
      {(image.title || image.description) && (
        <div className={styles.content}>
          {image.title && <h3 className={styles.title}>{image.title}</h3>}
          {image.description && (
            <p className={styles.description}>{image.description}</p>
          )}
        </div>
      )}
    </div>
  );
};
