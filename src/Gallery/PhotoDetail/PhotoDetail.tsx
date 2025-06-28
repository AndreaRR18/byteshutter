import React, { useEffect } from "react";
import type { GalleryPhoto } from "../GalleryGrid/GalleryItem";
import styles from "./PhotoDetail.module.css";

interface PhotoDetailProps {
  photo: GalleryPhoto;
  onClose: () => void;
}

export const PhotoDetail: React.FC<PhotoDetailProps> = ({ photo, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      const startY = event.touches[0].clientY;
      const startX = event.touches[0].clientX;

      const handleTouchMove = (moveEvent: TouchEvent) => {
        const currentY = moveEvent.touches[0].clientY;
        const currentX = moveEvent.touches[0].clientX;
        const deltaY = currentY - startY;
        const deltaX = currentX - startX;

        // Close on swipe down or up (threshold of 100px)
        if (Math.abs(deltaY) > 100 || Math.abs(deltaX) > 100) {
          onClose();
          document.removeEventListener("touchmove", handleTouchMove);
          document.removeEventListener("touchend", handleTouchEnd);
        }
      };

      const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", handleTouchStart);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleTouchStart);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          ×
        </button>
        
        <div className={styles.imageContainer}>
          <img
            src={`/gallery/${photo.imageName}`}
            alt={photo.title}
            className={styles.image}
          />
        </div>

        <div className={styles.info}>
          <h2 className={styles.title}>{photo.title}</h2>
          <p className={styles.description}>{photo.description}</p>
          <div className={styles.metadata}>
            <span className={styles.date}>{photo.creationDate}</span>
            {photo.iso && photo.aperture && photo.exposureTime && (
              <div className={styles.technical}>
                <span>ISO {photo.iso}</span>
                <span>{photo.aperture}</span>
                <span>{photo.exposureTime}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};