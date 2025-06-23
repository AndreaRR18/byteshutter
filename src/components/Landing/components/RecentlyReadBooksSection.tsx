import React from 'react';
import styles from '../Landing.module.css';

interface BookGridImages {
  pragmaticProgrammer: string;
  youDontKnowJs: string;
  designPatterns: string;
}

interface RecentlyReadBooksSectionProps {
  bookGridImages: BookGridImages;
}

const RecentlyReadBooksSection: React.FC<RecentlyReadBooksSectionProps> = ({ bookGridImages }) => {
  return (
    <div className={styles.landingSection}>
      <h2>Recently Read Books</h2>
      <div className={styles.recentlyRead}>
        <div className={styles.bookGrid}>
          <div className={styles.miniBookCard}>
            <img src={bookGridImages.pragmaticProgrammer} alt="Book cover" />
            <h4>The Pragmatic Programmer</h4>
            <p className={styles.miniBookAuthor}>by David Thomas & Andrew Hunt</p>
            <p className={styles.miniBookReview}>
              Excellent advice for becoming a more effective programmer. Practical tips that I apply daily.
            </p>
          </div>
          
          <div className={styles.miniBookCard}>
            <img src={bookGridImages.youDontKnowJs} alt="Book cover" />
            <h4>You Don't Know JS</h4>
            <p className={styles.miniBookAuthor}>by Kyle Simpson</p>
            <p className={styles.miniBookReview}>
              Deep dive into JavaScript fundamentals. Changed how I think about JavaScript completely.
            </p>
          </div>
          
          <div className={styles.miniBookCard}>
            <img src={bookGridImages.designPatterns} alt="Book cover" />
            <h4>Design Patterns</h4>
            <p className={styles.miniBookAuthor}>by Gang of Four</p>
            <p className={styles.miniBookReview}>
              Classic book on software design patterns. Essential reading for any software architect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentlyReadBooksSection; 