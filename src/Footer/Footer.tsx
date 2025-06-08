import React from 'react';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className={'light-mode'}>
    <p>&copy; {new Date().getFullYear()} byteshutter. All rights reserved.</p>
  </footer>
);

export default Footer;
