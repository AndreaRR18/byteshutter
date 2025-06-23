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
            <h3>Clean Code: A Handbook of Agile Software Craftsmanship</h3>
            <p className={styles.bookAuthor}>by Robert C. Martin</p>
            <p className={styles.bookNote}>
              Why I'm reading it: Essential principles for writing maintainable and clean code that every developer should know.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentlyReadingSection; 