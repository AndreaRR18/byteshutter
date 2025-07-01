import React from "react";
import styles from "./HighlightedPhotoSection.module.css";

interface HighlightedPhotoSectionProps {
  highlightedPhotoImage: string;
}

const HighlightedPhotoSection: React.FC<HighlightedPhotoSectionProps> = ({
  highlightedPhotoImage,
}) => {
  return (
    <div className={styles.landingSection}>
      <h2>Highlighted Photo</h2>
      <div className={styles.highlightedPhoto}>
        <div className={styles.photoContainer}>
          <img src={highlightedPhotoImage} alt="Highlighted photography work" />
        </div>
        <div className={styles.photoInfo}>Orange, who will fix this mess?</div>
      </div>
    </div>
  );
};

export default HighlightedPhotoSection;
