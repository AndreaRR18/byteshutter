import React from 'react';
import styles from './RecentlyReadBooksSection.module.css';
import BookCard, { type Book } from './BookCard';

interface RecentlyReadBooksSectionProps {
  books: Book[];
}

const RecentlyReadBooksSection: React.FC<RecentlyReadBooksSectionProps> = ({ books }) => {
  return (
    <div className={styles.landingSection}>
      <h2>Recently Read Books</h2>
      <div className={styles.recentlyRead}>
        <div className={styles.bookGrid}>
          {books.map((book, index) => (
            <BookCard key={index} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyReadBooksSection; 