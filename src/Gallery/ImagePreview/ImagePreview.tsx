import React from "react";
import styles from "./ImagePreview.module.css";
import { type GalleryImageWithMetadata } from "../GalleryUtils";

interface ImagePreviewProps {
  image: GalleryImageWithMetadata;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentIndex: number;
  totalImages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  image,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  currentIndex,
  totalImages,
  hasPrevious,
  hasNext,
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowLeft" && hasPrevious) {
      onPrevious();
    } else if (e.key === "ArrowRight" && hasNext) {
      onNext();
    }
  };

  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasPrevious) {
        onPrevious();
      } else if (e.key === "ArrowRight" && hasNext) {
        onNext();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleGlobalKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, onPrevious, onNext, hasPrevious, hasNext]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Controls positioned at viewport edges */}
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close preview"
      >
        ×
      </button>

      {/* Image counter */}
      <div className={styles.imageCounter}>
        {currentIndex + 1} / {totalImages}
      </div>

      {/* Navigation buttons at viewport edges */}
      {hasPrevious && (
        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={onPrevious}
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      {hasNext && (
        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={onNext}
          aria-label="Next image"
        >
          ›
        </button>
      )}

      <div className={styles.previewContainer}>
        <div className={styles.imageContainer}>
          <img src={image.src} alt={image.alt} className={styles.image} />
        </div>

        <div className={styles.metadata}>
          <div className={styles.leftSection}>
            <div className={styles.basicInfo}>
              {image.title && <h2 className={styles.title}>{image.title}</h2>}
              {image.description && (
                <p className={styles.description}>{image.description}</p>
              )}
            </div>
            {image.metadata && (
              <h3 className={styles.metadataTitle}>Photo Details</h3>
            )}
          </div>

          {image.metadata && (
            <div className={styles.technicalInfo}>
              <div className={styles.metadataGrid}>
                {image.metadata.iso && (
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataLabel}>ISO</span>
                    <span className={styles.metadataValue}>
                      {image.metadata.iso}
                    </span>
                  </div>
                )}
                {image.metadata.shutter && (
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataLabel}>Shutter</span>
                    <span className={styles.metadataValue}>
                      {image.metadata.shutter}
                    </span>
                  </div>
                )}
                {image.metadata.aperture && (
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataLabel}>Aperture</span>
                    <span className={styles.metadataValue}>
                      f/{image.metadata.aperture}
                    </span>
                  </div>
                )}
                {image.metadata.camera && (
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataLabel}>Camera</span>
                    <span className={styles.metadataValue}>
                      {image.metadata.camera}
                    </span>
                  </div>
                )}
                {image.metadata.lens && (
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataLabel}>Lens</span>
                    <span className={styles.metadataValue}>
                      {image.metadata.lens}
                    </span>
                  </div>
                )}
                {image.metadata.ev && (
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataLabel}>ev</span>
                    <span className={styles.metadataValue}>
                      {image.metadata.ev}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
