import React from 'react';
import styles from './GalleryItem.module.css';

export interface GalleryItemProps {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  onClick?: () => void;
}

export const GalleryItem: React.FC<GalleryItemProps> = ({
  src,
  alt,
  title,
  description,
  onClick
}) => {
  return (
    <div className={styles.galleryItem} onClick={onClick}>
      <div className={styles.imageContainer}>
        <img 
          src={src} 
          alt={alt} 
          className={styles.image}
          loading="lazy"
        />
      </div>
      {(title || description) && (
        <div className={styles.content}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}
    </div>
  );
};