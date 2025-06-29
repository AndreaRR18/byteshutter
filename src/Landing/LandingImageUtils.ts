import { getImageUrl } from "../Utils/ImageUtils";

/**
 * Predefined image paths for the Landing component
 * This provides a centralized way to manage all images used in the Landing component
 */
export const LANDING_IMAGES = {
  hero: 'highlighted/hero_image.jpg',
  bookCover: 'book_cover/ai_engineer_book_cover.jpg',
  bookGrid: {
    thePragmaticProgrammerBookCover: 'book_cover/the_pragmatic_programmer_book_cover.jpg',
    philosophySoftwareDesignerBookCover: 'book_cover/philosophy_software_designer_book_cover.jpg'
  },
  highlightedPhoto: 'highlighted/orange_pattern.jpg'
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