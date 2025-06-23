import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.footerContent}>
      <p className={styles.footerText}>
        &copy; {new Date().getFullYear()} byteshutter. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
