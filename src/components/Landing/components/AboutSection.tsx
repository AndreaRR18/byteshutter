import React from 'react';
import styles from '../Landing.module.css';

const AboutSection: React.FC = () => {
  return (
    <div className={styles.landingSection}>
      <h2>About Me</h2>
      <div className={styles.aboutContent}>
        <p>
          Hi there! I'm a passionate developer and photography enthusiast. I love to code and capture moments. 
          Follow my journey as I explore new technologies and photograph the world around me.
        </p>
      </div>
    </div>
  );
};

export default AboutSection; 