import React from 'react';
import styles from '../Landing.module.css';

const InterestingArticlesSection: React.FC = () => {
  return (
    <div className={styles.landingSection}>
      <h2>Interesting Articles</h2>
      <div className={styles.articlesList}>
        <ul>
          <li>
            <a href="https://blog.pragmaticengineer.com/stack-overflow-is-almost-dead/" target="_blank" rel="noopener noreferrer">
              Stack overflow is almost dead
            </a>
            <span> - Thanks for helping me to start my journey!</span>
          </li>
          <li>
            <a href="https://tidyfirst.substack.com/p/canon-tdd" target="_blank" rel="noopener noreferrer">
              Canon TDD
            </a>
            <span> - It might take a mental shift, but it can be worth it!</span>
          </li>
          <li>
            <a href="https://martinfowler.com/articles/2025-nature-abstraction.html" target="_blank" rel="noopener noreferrer">
              LLMs bring new nature of abstraction
            </a>
            <span> - LLMs are really transforming software development with non-determinism, marking a shift as big as moving from assembly to high-level languages. </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InterestingArticlesSection; 