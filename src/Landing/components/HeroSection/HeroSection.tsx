import React from 'react';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  heroImage: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ heroImage }) => {
  return (
    <div className={styles.landingHero}>
      <h1>Hey there, web surfer! Welcome to this little corner of the internet.</h1>
      <div className={styles.heroImage}>
        <img src={heroImage} alt="Hero - Tech and Photography" />
      </div>
      <p className={styles.landingDescription}>
        No analytics, no tracking, just a private place to explore. <br />
        Rest, read articles, see some photos, and share your thoughts only if you want to.
      </p>
    </div>
  );
};

export default HeroSection; 