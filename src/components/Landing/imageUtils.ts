/**
 * Image utilities for handling images in both development and production environments
 */

/**
 * Gets the base path for images based on the current environment
 * Images are always served from the base URL + images/
 */
export const getImageBasePath = (): string => {
  const base = import.meta.env.BASE_URL || '/';
  
  // Ensure proper path construction
  // Remove trailing slash from base to avoid double slashes
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${cleanBase}/images/`;
};

/**
 * Gets the full URL for an image file
 * @param imageName - The name of the image file (e.g., 'hero_image.jpg')
 */
export const getImageUrl = (imageName: string): string => {
  const basePath = getImageBasePath();
  return `${basePath}${imageName}`;
};

/**
 * Predefined image paths for the Landing component
 * This provides a centralized way to manage all images used in the Landing component
 */
export const LANDING_IMAGES = {
  hero: 'hero_image.jpg',
  bookCover: 'ai_engineer_book_cover.jpg',
  bookGrid: {
    thePragmaticProgrammerBookCover: 'the_pragmatic_programmer_book_cover.jpg',
    philosophySoftwareDesignerBookCover: 'philosophy_software_designer_book_cover.jpg'
  },
  highlightedPhoto: 'orange_pattern.jpg'
} as const;

/**
 * Hook-like function to get all Landing component images with proper URLs
 * This makes it easy to use in React components
 */
export const useLandingImages = () => {
  return {
    hero: getImageUrl(LANDING_IMAGES.hero),
    bookCover: getImageUrl(LANDING_IMAGES.bookCover),
    bookGrid: {
      thePragmaticProgrammerBookCover: getImageUrl(LANDING_IMAGES.bookGrid.thePragmaticProgrammerBookCover),
      philosophySoftwareDesignerBookCover: getImageUrl(LANDING_IMAGES.bookGrid.philosophySoftwareDesignerBookCover)
    },
    highlightedPhoto: getImageUrl(LANDING_IMAGES.highlightedPhoto)
  };
};

/**
 * Generic function to get images from a specific folder
 * @param folderName - The folder name (e.g., 'images', 'photos')
 * @param imageName - The image file name
 */
export const getImageFromFolder = (folderName: string, imageName: string): string => {
  const base = import.meta.env.BASE_URL || '/';
  
  // Ensure proper path construction
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${cleanBase}/${folderName}/${imageName}`;
};

/**
 * Utility to preload images for better performance
 * @param imageUrls - Array of image URLs to preload
 */
export const preloadImages = (imageUrls: string[]): void => {
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}; 