import './src/ArticlesList/ArticlesList';
import { renderArticles } from './src/ArticlesList/ArticlesList';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('articles-list');
    if (container) {
        renderArticles(container);
    }
});
