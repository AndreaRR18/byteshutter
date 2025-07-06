import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CurrentlyReadingSection from '../../../../../src/Landing/components/CurrentlyReadingSection/CurrentlyReadingSection';

const cover = 'cover.jpg';

describe('CurrentlyReadingSection', () => {
  it('renders book information', () => {
    render(<CurrentlyReadingSection bookCoverImage={cover} />);

    expect(screen.getByRole('heading', { name: 'Currently Reading' })).toBeInTheDocument();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', cover);
    expect(img).toHaveAttribute('alt', 'Current book cover');
    expect(
      screen.getByText('AI Engineering: Building Applications with Foundation Models')
    ).toBeInTheDocument();
    expect(screen.getByText('by Chip Huyen')).toBeInTheDocument();
    expect(screen.getByText(/Why I'm reading it/)).toBeInTheDocument();
  });

  it('updates book cover when prop changes', () => {
    const { rerender } = render(<CurrentlyReadingSection bookCoverImage={cover} />);

    const newCover = 'new-cover.jpg';
    rerender(<CurrentlyReadingSection bookCoverImage={newCover} />);

    expect(screen.getByRole('img')).toHaveAttribute('src', newCover);
  });
});
