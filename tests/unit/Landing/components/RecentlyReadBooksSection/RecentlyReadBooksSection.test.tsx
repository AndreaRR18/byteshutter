import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RecentlyReadBooksSection from '../../../../../src/Landing/components/RecentlyReadBooksSection/RecentlyReadBooksSection';
import BookCard from '../../../../../src/Landing/components/RecentlyReadBooksSection/BookCard';

vi.mock('../../../../../src/Landing/components/RecentlyReadBooksSection/BookCard', () => ({
  default: ({ book }: any) => <div data-testid="book-card">{book.title}</div>,
}));

const books = [
  { title: 'Book1', author: 'Author1', image: 'b1.jpg', description: 'desc1' },
  { title: 'Book2', author: 'Author2', image: 'b2.jpg', description: 'desc2' },
];

describe('RecentlyReadBooksSection', () => {
  it('renders heading and book cards', () => {
    render(<RecentlyReadBooksSection books={books} />);

    expect(screen.getByRole('heading', { name: 'Recently Read Books' })).toBeInTheDocument();
    const cards = screen.getAllByTestId('book-card');
    expect(cards).toHaveLength(2);
    expect(screen.getByText('Book1')).toBeInTheDocument();
    expect(screen.getByText('Book2')).toBeInTheDocument();
  });
});
