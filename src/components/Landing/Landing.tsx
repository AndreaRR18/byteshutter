import React from 'react';
import styles from './Landing.module.css';
import { useLandingImages, preloadImages } from './imageUtils';
import {
  HeroSection,
  AboutSection,
  CurrentlyReadingSection,
  RecentlyReadBooksSection,
  InterestingArticlesSection,
  HighlightedPhotoSection,
} from './components';

const Landing: React.FC = () => {
  // Get all images with proper URLs for dev and production
  const images = useLandingImages();
  
  // Preload images for better performance
  React.useEffect(() => {
    const imageUrls = [
      images.hero,
      images.bookCover,
      images.bookGrid.pragmaticProgrammer,
      images.bookGrid.youDontKnowJs,
      images.bookGrid.designPatterns,
      images.highlightedPhoto
    ];
    preloadImages(imageUrls);
  }, [images]);

  return (
    <div className={styles.landingContainer}>
      <div className={styles.landingContent}>
        <HeroSection heroImage={images.hero} />
        <AboutSection />
        <CurrentlyReadingSection bookCoverImage={images.bookCover} />
        <RecentlyReadBooksSection bookGridImages={images.bookGrid} />
        <InterestingArticlesSection />
        <HighlightedPhotoSection highlightedPhotoImage={images.highlightedPhoto} />
      </div>
    </div>
  );
};

export default Landing; 