import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Landing from '../../../src/Landing/Landing';
import { useLandingImages } from '../../../src/Landing/LandingImageUtils';
import { preloadImages } from '../../../src/Utils/ImageUtils';
import {
  HeroSection,
  AboutSection,
  CurrentlyReadingSection,
  RecentlyReadBooksSection,
  InterestingArticlesSection,
  HighlightedPhotoSection,
} from '../../../src/Landing/components';

vi.mock('../../../src/Landing/LandingImageUtils', () => ({
  useLandingImages: vi.fn(),
}));

vi.mock('../../../src/Utils/ImageUtils', () => ({
  preloadImages: vi.fn(),
}));

vi.mock('../../../src/Landing/components', () => ({
  HeroSection: ({ heroImage }: any) => <div data-testid="hero" data-img={heroImage} />,
  AboutSection: () => <div data-testid="about" />,
  CurrentlyReadingSection: ({ bookCoverImage }: any) => (
    <div data-testid="current" data-img={bookCoverImage} />
  ),
  RecentlyReadBooksSection: ({ books }: any) => (
    <div data-testid="recent" data-count={books.length} />
  ),
  InterestingArticlesSection: () => <div data-testid="articles" />,
  HighlightedPhotoSection: ({ highlightedPhotoImage }: any) => (
    <div data-testid="highlight" data-img={highlightedPhotoImage} />
  ),
}));

const mockImages = {
  hero: 'hero.jpg',
  bookCover: 'cover.jpg',
  bookGrid: {
    thePragmaticProgrammerBookCover: 'pp.jpg',
    philosophySoftwareDesignerBookCover: 'psd.jpg',
  },
  highlightedPhoto: 'photo.jpg',
};

vi.mocked(useLandingImages).mockReturnValue(mockImages);

describe('Landing', () => {
  it('renders all sections with proper props', () => {
    render(<Landing />);

    expect(screen.getByTestId('hero')).toHaveAttribute('data-img', mockImages.hero);
    expect(screen.getByTestId('about')).toBeInTheDocument();
    expect(screen.getByTestId('current')).toHaveAttribute('data-img', mockImages.bookCover);
    expect(screen.getByTestId('recent')).toHaveAttribute('data-count', '2');
    expect(screen.getByTestId('articles')).toBeInTheDocument();
    expect(screen.getByTestId('highlight')).toHaveAttribute('data-img', mockImages.highlightedPhoto);
  });

  it('preloads images on mount', () => {
    render(<Landing />);

    expect(preloadImages).toHaveBeenCalledTimes(1);
    expect(preloadImages).toHaveBeenCalledWith([
      mockImages.hero,
      mockImages.bookCover,
      mockImages.bookGrid.thePragmaticProgrammerBookCover,
      mockImages.bookGrid.philosophySoftwareDesignerBookCover,
      mockImages.highlightedPhoto,
    ]);
  });

  it('re-preloads images when image set changes', () => {
    const { rerender } = render(<Landing />);

    expect(preloadImages).toHaveBeenCalledTimes(1);

    const newImages = { ...mockImages, hero: 'new-hero.jpg' };
    vi.mocked(useLandingImages).mockReturnValueOnce(newImages);

    rerender(<Landing />);

    expect(preloadImages).toHaveBeenCalledTimes(2);
    expect(preloadImages).toHaveBeenLastCalledWith([
      newImages.hero,
      newImages.bookCover,
      newImages.bookGrid.thePragmaticProgrammerBookCover,
      newImages.bookGrid.philosophySoftwareDesignerBookCover,
      newImages.highlightedPhoto,
    ]);
  });
});
