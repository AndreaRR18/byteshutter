import React from 'react';
import styles from './BookCard.module.css';

export interface Book {
  title: string;
  author: string;
  image: string;
  description: string;
}

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className={styles.miniBookCard}>
      <img src={book.image} alt={`${book.title} cover`} />
      <h4>{book.title}</h4>
      <p className={styles.miniBookAuthor}>by {book.author}</p>
      <p className={styles.miniBookReview}>
        {book.description}
      </p>
    </div>
  );
};

export default BookCard; 