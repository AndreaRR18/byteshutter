import React from 'react';
import './Footer.css';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className={'light-mode'}>
      <div className="social-links">
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
      <p>&copy; {new Date().getFullYear()} byteshutter. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
