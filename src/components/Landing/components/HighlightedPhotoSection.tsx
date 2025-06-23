import React from 'react';
import styles from '../Landing.module.css';

interface HighlightedPhotoSectionProps {
  highlightedPhotoImage: string;
}

const HighlightedPhotoSection: React.FC<HighlightedPhotoSectionProps> = ({ highlightedPhotoImage }) => {
  return (
    <div className={styles.landingSection}>
      <h2>Highlighted Photo</h2>
      <div className={styles.highlightedPhoto}>
        <div className={styles.photoContainer}>
          <img src={highlightedPhotoImage} alt="Highlighted photography work" />
        </div>
        <div className={styles.photoInfo}>
          <h3>Golden Hour at the Mountain Peak</h3>
          <p>
            Captured during a hiking trip in the Rocky Mountains. The golden hour light created this 
            stunning silhouette effect against the dramatic sky. Shot with a Canon EOS R5 at f/8, 
            1/250s, ISO 100. This moment reminded me why I fell in love with landscape photography.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HighlightedPhotoSection; 