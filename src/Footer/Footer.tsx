import React from 'react';
import './Footer.css';

const Footer: React.FC = () => (
  <footer>
    <div className="footer-content">
      <div className="social-links">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
      <p>&copy; {new Date().getFullYear()} byteshutter. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
