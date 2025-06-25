import React from 'react';
import styles from '../Landing.module.css';

const AboutSection: React.FC = () => {
  return (
    <div className={styles.landingSection}>
      <h2>About Me</h2>
      <div className={styles.aboutContent}>
        <p>
        By the way, I'm Andrea, nice to meet you! If you're curious about me, there's a whole section on my background. But if you're too lazy to read that, well, now you know my name!
        </p>
      </div>
    </div>
  );
};

export default AboutSection; 