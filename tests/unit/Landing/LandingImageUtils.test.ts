import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MockedFunction } from 'vitest';
import { useLandingImages, LANDING_IMAGES } from '../../../src/Landing/LandingImageUtils';
import { getImageUrl } from '../../../src/Utils/ImageUtils';

vi.mock('../../../src/Utils/ImageUtils', () => ({
  getImageUrl: vi.fn() as MockedFunction<(path: string) => string>,
}));

// Type for returned images
type LandingImages = ReturnType<typeof useLandingImages>;

describe('LandingImageUtils', () => {
  describe('LANDING_IMAGES', () => {
    it('contains all expected image constants', () => {
      expect(LANDING_IMAGES).toHaveProperty('hero');
      expect(LANDING_IMAGES).toHaveProperty('bookCover');
      expect(LANDING_IMAGES).toHaveProperty('bookGrid');
      expect(LANDING_IMAGES.bookGrid).toHaveProperty('thePragmaticProgrammerBookCover');
      expect(LANDING_IMAGES.bookGrid).toHaveProperty('philosophySoftwareDesignerBookCover');
      expect(LANDING_IMAGES).toHaveProperty('highlightedPhoto');
    });

    it('has correct image paths', () => {
      expect(LANDING_IMAGES.hero).toBe('highlighted/hero_image.jpg');
      expect(LANDING_IMAGES.bookCover).toBe('book_cover/ai_engineer_book_cover.jpg');
      expect(LANDING_IMAGES.bookGrid.thePragmaticProgrammerBookCover).toBe(
        'book_cover/the_pragmatic_programmer_book_cover.jpg'
      );
      expect(LANDING_IMAGES.bookGrid.philosophySoftwareDesignerBookCover).toBe(
        'book_cover/philosophy_software_designer_book_cover.jpg'
      );
      expect(LANDING_IMAGES.highlightedPhoto).toBe('highlighted/orange_pattern.jpg');
    });
  });

  describe('useLandingImages', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(getImageUrl).mockImplementation((path: string) => `https://example.com/${path}`);
    });

    it('returns an object with correct structure', () => {
      const images: LandingImages = useLandingImages();

      expect(images).toHaveProperty('hero');
      expect(images).toHaveProperty('bookCover');
      expect(images).toHaveProperty('bookGrid');
      expect(images.bookGrid).toHaveProperty('thePragmaticProgrammerBookCover');
      expect(images.bookGrid).toHaveProperty('philosophySoftwareDesignerBookCover');
      expect(images).toHaveProperty('highlightedPhoto');
    });

    it('calls getImageUrl for each image', () => {
      useLandingImages();

      expect(getImageUrl).toHaveBeenCalledTimes(5);
      expect(getImageUrl).toHaveBeenCalledWith('highlighted/hero_image.jpg');
      expect(getImageUrl).toHaveBeenCalledWith('book_cover/ai_engineer_book_cover.jpg');
      expect(getImageUrl).toHaveBeenCalledWith('book_cover/the_pragmatic_programmer_book_cover.jpg');
      expect(getImageUrl).toHaveBeenCalledWith('book_cover/philosophy_software_designer_book_cover.jpg');
      expect(getImageUrl).toHaveBeenCalledWith('highlighted/orange_pattern.jpg');
    });

    it('returns images with proper src URLs', () => {
      const images = useLandingImages();

      expect(images.hero).toBe('https://example.com/highlighted/hero_image.jpg');
      expect(images.bookCover).toBe('https://example.com/book_cover/ai_engineer_book_cover.jpg');
      expect(images.bookGrid.thePragmaticProgrammerBookCover).toBe(
        'https://example.com/book_cover/the_pragmatic_programmer_book_cover.jpg'
      );
      expect(images.bookGrid.philosophySoftwareDesignerBookCover).toBe(
        'https://example.com/book_cover/philosophy_software_designer_book_cover.jpg'
      );
      expect(images.highlightedPhoto).toBe('https://example.com/highlighted/orange_pattern.jpg');
    });

    it('handles edge case when getImageUrl returns empty string', () => {
      vi.mocked(getImageUrl).mockReturnValue('');

      const images = useLandingImages();

      expect(images.hero).toBe('');
      expect(images.bookCover).toBe('');
      expect(images.bookGrid.thePragmaticProgrammerBookCover).toBe('');
      expect(images.bookGrid.philosophySoftwareDesignerBookCover).toBe('');
      expect(images.highlightedPhoto).toBe('');
    });

    it('throws when getImageUrl throws an error', () => {
      vi.mocked(getImageUrl).mockImplementation(() => {
        throw new Error('Image URL error');
      });

      expect(() => useLandingImages()).toThrow('Image URL error');
    });

    it('returns immutable objects', () => {
      const images = useLandingImages();
      const originalHero = images.hero;

      // modify returned object
      (images as any).hero = 'changed';

      const newImages = useLandingImages();
      expect(newImages.hero).toBe(originalHero);
    });
  });
});
