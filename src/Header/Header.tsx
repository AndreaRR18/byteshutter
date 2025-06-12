import React from 'react';
import './Header.css';

const Header: React.FC = () => (
  <header>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/articles">Articles</a></li>
        <li><a href="/about">About</a></li>
      </ul>
      <button className="dark-mode-toggle" aria-label="Toggle dark mode">
        Theme
      </button>
    </nav>
  </header>
);

export default Header;
