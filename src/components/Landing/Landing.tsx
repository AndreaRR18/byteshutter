import React from 'react';
import styles from './Landing.module.css';
import { useLandingImages, preloadImages } from './imageUtils';

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
        {/* Hero Section */}
        <div className={styles.landingHero}>
          <div className={styles.heroImage}>
            <img src={images.hero} alt="Hero - Tech and Photography" />
          </div>
          <h1>My Tech & Photography Journey</h1>
          <div className={styles.landingSubtitle}>
            Exploring Code and Capturing Moments
          </div>
          <p className={styles.landingDescription}>
            Welcome to my blog! Here, I share my journey in programming and photography. 
            Explore my latest projects, book recommendations, and photo highlights.
          </p>
        </div>

        {/* About Me Section */}
        <div className={styles.landingSection}>
          <h2>About Me</h2>
          <div className={styles.aboutContent}>
            <p>
              Hi there! I'm a passionate developer and photography enthusiast. I love to code and capture moments. 
              Follow my journey as I explore new technologies and photograph the world around me.
            </p>
          </div>
        </div>

        {/* Currently Reading Section */}
        <div className={styles.landingSection}>
          <h2>Currently Reading</h2>
          <div className={styles.currentlyReading}>
            <div className={styles.bookCard}>
              <div className={styles.bookCover}>
                <img src={images.bookCover} alt="Current book cover" />
              </div>
              <div className={styles.bookInfo}>
                <h3>Clean Code: A Handbook of Agile Software Craftsmanship</h3>
                <p className={styles.bookAuthor}>by Robert C. Martin</p>
                <p className={styles.bookNote}>
                  Why I'm reading it: Essential principles for writing maintainable and clean code that every developer should know.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Read Books Section */}
        <div className={styles.landingSection}>
          <h2>Recently Read Books</h2>
          <div className={styles.recentlyRead}>
            <div className={styles.bookGrid}>
              <div className={styles.miniBookCard}>
                <img src={images.bookGrid.pragmaticProgrammer} alt="Book cover" />
                <h4>The Pragmatic Programmer</h4>
                <p className={styles.miniBookAuthor}>by David Thomas & Andrew Hunt</p>
                <p className={styles.miniBookReview}>
                  Excellent advice for becoming a more effective programmer. Practical tips that I apply daily.
                </p>
              </div>
              
              <div className={styles.miniBookCard}>
                <img src={images.bookGrid.youDontKnowJs} alt="Book cover" />
                <h4>You Don't Know JS</h4>
                <p className={styles.miniBookAuthor}>by Kyle Simpson</p>
                <p className={styles.miniBookReview}>
                  Deep dive into JavaScript fundamentals. Changed how I think about JavaScript completely.
                </p>
              </div>
              
              <div className={styles.miniBookCard}>
                <img src={images.bookGrid.designPatterns} alt="Book cover" />
                <h4>Design Patterns</h4>
                <p className={styles.miniBookAuthor}>by Gang of Four</p>
                <p className={styles.miniBookReview}>
                  Classic book on software design patterns. Essential reading for any software architect.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interesting Articles Section */}
        <div className={styles.landingSection}>
          <h2>Interesting Articles</h2>
          <div className={styles.articlesList}>
            <ul>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  The Future of Web Development: Trends to Watch in 2024
                </a>
                <span> - An insightful look at emerging technologies shaping web development.</span>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Mastering Portrait Photography: Light and Composition
                </a>
                <span> - Essential techniques for capturing compelling portraits in natural light.</span>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Building Scalable React Applications with TypeScript
                </a>
                <span> - Best practices for structuring large React applications with TypeScript.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Highlighted Photo Section */}
        <div className={styles.landingSection}>
          <h2>Highlighted Photo</h2>
          <div className={styles.highlightedPhoto}>
            <div className={styles.photoContainer}>
              <img src={images.highlightedPhoto} alt="Highlighted photography work" />
            </div>
            <div className={styles.photoInfo}>
              <h3>Golden Hour at the Mountain Peak</h3>
              <p>
                Captured during a hiking trip in the Rocky Mountains. The golden hour light created this 
                stunning silhouette effect against the dramatic sky. Shot with a Canon EOS R5 at f/8, 
                1/250s, ISO 100. This moment reminded me why I fell in love with landscape photography.
              </p>
            </div>
          </div>
        </div>

        {/* Photographers I Follow Section */}
        <div className={styles.landingSection}>
          <h2>Photographers I Follow</h2>
          <div className={styles.photographersList}>
            <ul>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Ansel Adams
                </a>
                <span> - Master of black and white landscape photography, known for his stunning wilderness images.</span>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Annie Leibovitz
                </a>
                <span> - Renowned portrait photographer famous for her intimate and dramatic celebrity portraits.</span>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Henri Cartier-Bresson
                </a>
                <span> - Pioneer of street photography, master of capturing "decisive moments" in everyday life.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Follow Me Section */}
        <div className={styles.landingSection}>
          <h2>Follow Me</h2>
          <div className={styles.socialLinks}>
            <a href="#" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <span className={styles.socialIcon}>📷</span>
              <span>Instagram</span>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <span className={styles.socialIcon}>🐦</span>
              <span>Twitter</span>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <span className={styles.socialIcon}>💻</span>
              <span>GitHub</span>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <span className={styles.socialIcon}>💼</span>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing; 