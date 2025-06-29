import React from 'react';
import styles from './Landing.module.css';
import { useLandingImages, preloadImages } from '../Utils/ImageUtils';
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
  
  // Books data for Recently Read Books section
  const books = [
    {
      title: "The Pragmatic Programmer",
      author: "David Thomas & Andrew Hunt",
      image: images.bookGrid.thePragmaticProgrammerBookCover,
      description: "The Pragmatic Programmer: From Journeyman to Master is a book about computer programming and software engineering, written by Andrew Hunt and David Thomas and published in October 1999"
    },
    {
      title: "A Philosophy of Software Design",
      author: "John Ousterhout",
      image: images.bookGrid.philosophySoftwareDesignerBookCover,
      description: "This book addresses the topic of software design: how to decompose complex software systems into modules (such as classes and methods) that can be implemented relatively independently."
    }
  ];
  
  // Preload images for better performance
  React.useEffect(() => {
    const imageUrls = [
      images.hero,
      images.bookCover,
      images.bookGrid.thePragmaticProgrammerBookCover,
      images.bookGrid.philosophySoftwareDesignerBookCover,
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
        <RecentlyReadBooksSection books={books} />
        <InterestingArticlesSection />
        <HighlightedPhotoSection highlightedPhotoImage={images.highlightedPhoto} />
      </div>
    </div>
  );
};

export default Landing; 