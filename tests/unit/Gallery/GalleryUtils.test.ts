import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MockedFunction } from 'vitest';
import { useGalleryImages, GALLERY_IMAGES } from '../../../src/Gallery/GalleryUtils';
import type { GalleryImageWithMetadata } from '../../../src/Gallery/GalleryUtils';
import { getImageUrl } from '../../../src/Utils/ImageUtils';

vi.mock('../../../src/Utils/ImageUtils', () => ({
  getImageUrl: vi.fn() as MockedFunction<(path: string) => string>,
}));

describe('GalleryUtils', () => {
  describe('GALLERY_IMAGES', () => {
    it('contains all expected image constants', () => {
      expect(GALLERY_IMAGES).toHaveProperty('angryOct');
      expect(GALLERY_IMAGES).toHaveProperty('archWalkingMan');
      expect(GALLERY_IMAGES).toHaveProperty('bishopShadow');
      expect(GALLERY_IMAGES).toHaveProperty('churchBook');
      expect(GALLERY_IMAGES).toHaveProperty('dotsBird');
      expect(GALLERY_IMAGES).toHaveProperty('shadow');
      expect(GALLERY_IMAGES).toHaveProperty('stairs');
    });

    it('has correct image paths', () => {
      expect(GALLERY_IMAGES.angryOct).toBe('gallery/angry_oct.jpeg');
      expect(GALLERY_IMAGES.archWalkingMan).toBe('gallery/arch_walking_man.jpeg');
      expect(GALLERY_IMAGES.bishopShadow).toBe('gallery/bishop_shadow.jpeg');
      expect(GALLERY_IMAGES.churchBook).toBe('gallery/church_book.jpeg');
      expect(GALLERY_IMAGES.dotsBird).toBe('gallery/dots_bird.jpeg');
      expect(GALLERY_IMAGES.shadow).toBe('gallery/shadow.jpeg');
      expect(GALLERY_IMAGES.stairs).toBe('gallery/stairs.jpeg');
    });
  });

  describe('useGalleryImages', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(getImageUrl).mockImplementation((path: string): string => `https://example.com/images/${path}`);
    });

    it('returns an array of gallery images', () => {
      const images: GalleryImageWithMetadata[] = useGalleryImages();
      
      expect(Array.isArray(images)).toBe(true);
      expect(images).toHaveLength(7);
    });

    it('returns images with correct structure', () => {
      const images: GalleryImageWithMetadata[] = useGalleryImages();
      
      images.forEach((image) => {
        expect(image).toHaveProperty('src');
        expect(image).toHaveProperty('alt');
        expect(image).toHaveProperty('title');
        expect(image).toHaveProperty('description');
        expect(image).toHaveProperty('metadata');
        
        expect(typeof image.src).toBe('string');
        expect(typeof image.alt).toBe('string');
        expect(typeof image.title).toBe('string');
        expect(typeof image.description).toBe('string');
        expect(typeof image.metadata).toBe('object');
      });
    });

    it('calls getImageUrl for each image', () => {
      useGalleryImages();
      
      expect(getImageUrl).toHaveBeenCalledTimes(7);
      expect(getImageUrl).toHaveBeenCalledWith('gallery/angry_oct.jpeg');
      expect(getImageUrl).toHaveBeenCalledWith('gallery/arch_walking_man.jpeg');
      expect(getImageUrl).toHaveBeenCalledWith('gallery/bishop_shadow.jpeg');
      expect(getImageUrl).toHaveBeenCalledWith('gallery/church_book.jpeg');
      expect(getImageUrl).toHaveBeenCalledWith('gallery/dots_bird.jpeg');
      expect(getImageUrl).toHaveBeenCalledWith('gallery/shadow.jpeg');
      expect(getImageUrl).toHaveBeenCalledWith('gallery/stairs.jpeg');
    });

    it('returns images with proper src URLs', () => {
      const images = useGalleryImages();
      
      expect(images[0].src).toBe('https://example.com/images/gallery/angry_oct.jpeg');
      expect(images[1].src).toBe('https://example.com/images/gallery/arch_walking_man.jpeg');
      expect(images[2].src).toBe('https://example.com/images/gallery/bishop_shadow.jpeg');
      expect(images[3].src).toBe('https://example.com/images/gallery/church_book.jpeg');
      expect(images[4].src).toBe('https://example.com/images/gallery/dots_bird.jpeg');
      expect(images[5].src).toBe('https://example.com/images/gallery/shadow.jpeg');
      expect(images[6].src).toBe('https://example.com/images/gallery/stairs.jpeg');
    });

    it('returns first image with correct data', () => {
      const images = useGalleryImages();
      const firstImage = images[0];
      
      expect(firstImage.alt).toBe('Angry Octopus');
      expect(firstImage.title).toBe('Angry Oct');
      expect(firstImage.description).toBe('Dynamic street art captured in urban setting');
      expect(firstImage.metadata).toEqual({
        iso: '400',
        shutter: '1/320',
        aperture: '7.1',
        camera: 'Nikon D3100',
        lens: '35mm',
        ev: '-0,3',
      });
    });

    it('returns last image with correct data', () => {
      const images = useGalleryImages();
      const lastImage = images[6];
      
      expect(lastImage.alt).toBe('Architectural stairs');
      expect(lastImage.title).toBe('Stairs');
      expect(lastImage.description).toBe('Geometric patterns formed by architectural staircase');
      expect(lastImage.metadata).toEqual({
        iso: '800',
        shutter: '1/400s',
        aperture: '3.5',
        camera: 'Nikon D3100',
        lens: '35mm',
        ev: '-0,3',
      });
    });

    it('returns images with all required metadata fields', () => {
      const images = useGalleryImages();
      
      images.forEach((image) => {
        expect(image.metadata).toHaveProperty('iso');
        expect(image.metadata).toHaveProperty('shutter');
        expect(image.metadata).toHaveProperty('aperture');
        expect(image.metadata).toHaveProperty('camera');
        expect(image.metadata).toHaveProperty('lens');
        expect(image.metadata).toHaveProperty('ev');
        
        expect(typeof image.metadata?.iso).toBe('string');
        expect(typeof image.metadata?.shutter).toBe('string');
        expect(typeof image.metadata?.aperture).toBe('string');
        expect(typeof image.metadata?.camera).toBe('string');
        expect(typeof image.metadata?.lens).toBe('string');
        expect(typeof image.metadata?.ev).toBe('string');
      });
    });

    it('handles different camera settings across images', () => {
      const images = useGalleryImages();
      
      const isoValues = images.map(img => img.metadata?.iso);
      const shutterValues = images.map(img => img.metadata?.shutter);
      const apertureValues = images.map(img => img.metadata?.aperture);
      
      expect(isoValues).toContain('100');
      expect(isoValues).toContain('400');
      expect(isoValues).toContain('800');
      expect(isoValues).toContain('1600');
      
      expect(shutterValues).toContain('1/320');
      expect(shutterValues).toContain('1/800s');
      expect(shutterValues).toContain('1/100s');
      
      expect(apertureValues).toContain('7.1');
      expect(apertureValues).toContain('2.5');
      expect(apertureValues).toContain('6.3');
    });

    it('verifies all images use the same camera and lens', () => {
      const images = useGalleryImages();
      
      images.forEach((image) => {
        expect(image.metadata?.camera).toBe('Nikon D3100');
        expect(image.metadata?.lens).toBe('35mm');
      });
    });

    it('verifies all images have the same exposure compensation', () => {
      const images = useGalleryImages();
      
      images.forEach((image) => {
        expect(image.metadata?.ev).toBe('-0,3');
      });
    });

    it('returns consistent data across multiple calls', () => {
      const images1 = useGalleryImages();
      const images2 = useGalleryImages();
      
      expect(images1).toEqual(images2);
      expect(images1.length).toBe(images2.length);
    });

    it('returns images in the correct order', () => {
      const images = useGalleryImages();
      
      expect(images[0].title).toBe('Angry Oct');
      expect(images[1].title).toBe('Arch Walking Man');
      expect(images[2].title).toBe('Bishop Shadow');
      expect(images[3].title).toBe('Church Book');
      expect(images[4].title).toBe('Dots Bird');
      expect(images[5].title).toBe('Shadow');
      expect(images[6].title).toBe('Stairs');
    });

    it('handles edge case when getImageUrl returns empty string', () => {
      vi.mocked(getImageUrl).mockReturnValue('');
      
      const images = useGalleryImages();
      
      images.forEach((image) => {
        expect(image.src).toBe('');
      });
    });

    it('handles edge case when getImageUrl throws error', () => {
      vi.mocked(getImageUrl).mockImplementation(() => {
        throw new Error('Image URL error');
      });
      
      expect(() => useGalleryImages()).toThrow('Image URL error');
    });

    it('returns immutable objects', () => {
      const images = useGalleryImages();
      const originalTitle = images[0].title;
      
      // Try to modify the title
      images[0].title = 'Modified Title';
      
      // Get fresh data
      const newImages = useGalleryImages();
      
      // Original data should be unchanged
      expect(newImages[0].title).toBe(originalTitle);
    });
  });
});