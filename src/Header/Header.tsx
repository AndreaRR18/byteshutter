import React from 'react';
import './Header.css';

const Header: React.FC = () => (
  <header>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
      </ul>
      <button className="dark-mode-toggle" aria-label="Toggle dark mode">
        Theme
      </button>
    </nav>
  </header>
);

export default Header;
