import React, { useMemo } from "react";
import styles from "./Landing.module.css";
import { useLandingImages } from "./LandingImageUtils";
import { preloadImages, getImageUrl } from "../Utils/ImageUtils";
import { RECENTLY_READ_BOOKS } from "../data/books";

import {
  HeroSection,
  AboutSection,
  CurrentlyReadingSection,
  RecentlyReadBooksSection,
  InterestingArticlesSection,
  HighlightedPhotoSection,
} from "./components";

const Landing: React.FC = () => {
  // Get all images with proper URLs for dev and production
  const images = useLandingImages();

  // Map books data with proper image URLs
  const books = useMemo(
    () =>
      RECENTLY_READ_BOOKS.map((book) => ({
        ...book,
        image: getImageUrl(book.image),
      })),
    [],
  );

  // Preload images for better performance
  React.useEffect(() => {
    const imageUrls = [
      images.hero,
      images.bookCover,
      images.bookGrid.thePragmaticProgrammerBookCover,
      images.bookGrid.philosophySoftwareDesignerBookCover,
      images.highlightedPhoto,
    ];
    preloadImages(imageUrls);
  }, [images]);

  return (
    <div className={styles.landingContainer}>
      <div className={styles.landingContent}>
        <HeroSection heroImage={images.hero} />
        <AboutSection />
        <CurrentlyReadingSection bookCoverImage={images.bookCover} />
        <RecentlyReadBooksSection books={books} />
        <InterestingArticlesSection />
        <HighlightedPhotoSection
          highlightedPhotoImage={images.highlightedPhoto}
        />
      </div>
    </div>
  );
};

export default Landing;
