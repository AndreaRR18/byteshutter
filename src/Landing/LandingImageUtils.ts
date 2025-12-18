import { useMemo } from "react";
import { getImageUrl } from "../Utils/ImageUtils";

/**
 * Predefined image paths for the Landing component
 * This provides a centralized way to manage all images used in the Landing component
 */
export const LANDING_IMAGES = {
  hero: "highlighted/hero_image.jpg",
  bookCover: "book_cover/ai_engineer_book_cover.jpg",
  bookGrid: {
    thePragmaticProgrammerBookCover:
      "book_cover/the_pragmatic_programmer_book_cover.jpg",
    philosophySoftwareDesignerBookCover:
      "book_cover/philosophy_software_designer_book_cover.jpg",
    oneThousandNineHundredEightyFourBookCover:
      "book_cover/oneThousandNineHundredEightyFourBookCover.jpg",
  },
  highlightedPhoto: "highlighted/orange_pattern.jpg",
} as const;

/**
 * Hook to get all Landing component images with proper URLs
 * Memoized to prevent recreating the object on every render
 */
export const useLandingImages = () => {
  return useMemo(
    () => ({
      hero: getImageUrl(LANDING_IMAGES.hero),
      bookCover: getImageUrl(LANDING_IMAGES.bookCover),
      bookGrid: {
        thePragmaticProgrammerBookCover: getImageUrl(
          LANDING_IMAGES.bookGrid.thePragmaticProgrammerBookCover,
        ),
        philosophySoftwareDesignerBookCover: getImageUrl(
          LANDING_IMAGES.bookGrid.philosophySoftwareDesignerBookCover,
        ),
        oneThousandNineHundredEightyFourBookCover: getImageUrl(
          LANDING_IMAGES.bookGrid.oneThousandNineHundredEightyFourBookCover,
        ),
      },
      highlightedPhoto: getImageUrl(LANDING_IMAGES.highlightedPhoto),
    }),
    [], // Empty deps - BASE_URL is constant
  );
};
