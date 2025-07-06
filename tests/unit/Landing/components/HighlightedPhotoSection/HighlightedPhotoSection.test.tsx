import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HighlightedPhotoSection from '../../../../../src/Landing/components/HighlightedPhotoSection/HighlightedPhotoSection';

const photo = 'photo.jpg';

describe('HighlightedPhotoSection', () => {
  it('renders heading and image', () => {
    render(<HighlightedPhotoSection highlightedPhotoImage={photo} />);

    expect(screen.getByRole('heading', { name: 'Highlighted Photo' })).toBeInTheDocument();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', photo);
    expect(img).toHaveAttribute('alt', 'Highlighted photography work');
    expect(screen.getByText('Orange, who will fix this mess?')).toBeInTheDocument();
  });
});
