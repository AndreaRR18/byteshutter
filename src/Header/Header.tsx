import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
  <header>
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
      <button className="dark-mode-toggle" aria-label="Toggle dark mode">
        Theme
      </button>
    </nav>
  </header>
);

export default Header;
