import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BookCard from '../../../../../src/Landing/components/RecentlyReadBooksSection/BookCard';

const book = {
  title: 'Book Title',
  author: 'Author Name',
  image: 'book.jpg',
  description: 'Book description',
};

describe('BookCard', () => {
  it('renders book details', () => {
    render(<BookCard book={book} />);

    expect(screen.getByRole('img')).toHaveAttribute('src', book.image);
    expect(screen.getByRole('img')).toHaveAttribute('alt', `${book.title} cover`);
    expect(screen.getByText(book.title)).toBeInTheDocument();
    expect(screen.getByText(`by ${book.author}`)).toBeInTheDocument();
    expect(screen.getByText(book.description)).toBeInTheDocument();
  });
});
