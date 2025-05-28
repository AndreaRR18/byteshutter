import './ArticlesList/ArticlesList';
import { renderArticles } from './ArticlesList/ArticlesList';

// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('articles-list');
  if (container) {
    renderArticles(container);
  }
});