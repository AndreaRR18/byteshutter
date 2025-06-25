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
      <h1>Hey there, web surfer! Welcome to our space.</h1>
      <p className={styles.landingDescription}>
        No analytics, no tracking, just a private place to explore. <br />
        Rest, read articles, see some photos, and share your thoughts only if you want to.
      </p>
    </div>
  );
};

export default HeroSection; 