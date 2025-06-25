import React from 'react';
import styles from '../Landing.module.css';

interface CurrentlyReadingSectionProps {
  bookCoverImage: string;
}

const CurrentlyReadingSection: React.FC<CurrentlyReadingSectionProps> = ({ bookCoverImage }) => {
  return (
    <div className={styles.landingSection}>
      <h2>Currently Reading</h2>
      <div className={styles.currentlyReading}>
        <div className={styles.bookCard}>
          <div className={styles.bookCover}>
            <img src={bookCoverImage} alt="Current book cover" />
          </div>
          <div className={styles.bookInfo}>
            <h3>AI Engineering: Building Applications with Foundation Models</h3>
            <p className={styles.bookAuthor}>by Chip Huyen</p>
            <p className={styles.bookNote}>
              Why I'm reading it: We're living in the age of AI, so who am I to skip a book on the subject?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentlyReadingSection; 