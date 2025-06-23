import React from 'react';
import styles from '../Landing.module.css';

const InterestingArticlesSection: React.FC = () => {
  return (
    <div className={styles.landingSection}>
      <h2>Interesting Articles</h2>
      <div className={styles.articlesList}>
        <ul>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer">
              The Future of Web Development: Trends to Watch in 2024
            </a>
            <span> - An insightful look at emerging technologies shaping web development.</span>
          </li>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer">
              Mastering Portrait Photography: Light and Composition
            </a>
            <span> - Essential techniques for capturing compelling portraits in natural light.</span>
          </li>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer">
              Building Scalable React Applications with TypeScript
            </a>
            <span> - Best practices for structuring large React applications with TypeScript.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InterestingArticlesSection; 