import React from 'react';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer-content">
      <p className="footer-text">
        &copy; {new Date().getFullYear()} byteshutter. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
