import React from 'react';
import styles from '../Landing.module.css';

interface HeroSectionProps {
  heroImage: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ heroImage }) => {
  return (
    <div className={styles.landingHero}>
      <div className={styles.heroImage}>
        <img src={heroImage} alt="Hero - Tech and Photography" />
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
  );
};

export default HeroSection; 