import React from 'react';
import styles from './ImagePreview.module.css';
import { type GalleryImageWithMetadata } from './GalleryUtils';

interface ImagePreviewProps {
  image: GalleryImageWithMetadata;
  isOpen: boolean;
  onClose: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  image, 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <div 
      className={styles.overlay} 
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className={styles.previewContainer}>
        <button 
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close preview"
        >
          ×
        </button>
        
        <div className={styles.imageContainer}>
          <img 
            src={image.src} 
            alt={image.alt}
            className={styles.image}
          />
        </div>
        
        <div className={styles.metadata}>
          <div className={styles.basicInfo}>
            {image.title && <h2 className={styles.title}>{image.title}</h2>}
            {image.description && <p className={styles.description}>{image.description}</p>}
          </div>
          
          {image.metadata && (
            <div className={styles.technicalInfo}>
              <h3 className={styles.metadataTitle}>Photo Details</h3>
              <div className={styles.metadataGrid}>
                {image.metadata.iso && (
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataLabel}>ISO</span>
                    <span className={styles.metadataValue}>{image.metadata.iso}</span>
                  </div>
                )}
                {image.metadata.shutter && (
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataLabel}>Shutter</span>
                    <span className={styles.metadataValue}>{image.metadata.shutter}</span>
                  </div>
                )}
                {image.metadata.aperture && (
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataLabel}>Aperture</span>
                    <span className={styles.metadataValue}>f/{image.metadata.aperture}</span>
                  </div>
                )}
                {image.metadata.time && (
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataLabel}>Date</span>
                    <span className={styles.metadataValue}>{image.metadata.time}</span>
                  </div>
                )}
                {image.metadata.camera && (
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataLabel}>Camera</span>
                    <span className={styles.metadataValue}>{image.metadata.camera}</span>
                  </div>
                )}
                {image.metadata.lens && (
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataLabel}>Lens</span>
                    <span className={styles.metadataValue}>{image.metadata.lens}</span>
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