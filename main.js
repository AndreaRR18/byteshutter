import { renderArticles } from './dist/ArticlesList/ArticlesList.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('articles-list');
    if (container) {
        renderArticles(container);
    }
});
