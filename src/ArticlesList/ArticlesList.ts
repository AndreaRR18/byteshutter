import { marked } from 'marked';

// Define the structure of an article
interface Article {
  id: number;
  title: string;
  content: string;
}

// Sample data: In a real scenario, you would fetch this from markdown files
const articles: Article[] = [
  { id: 1, title: 'Article 1', content: '# Article 1\n\nContent for Article 1' },
  { id: 2, title: 'Article 2', content: '# Article 2\n\nContent for Article 2' },
  // Add more articles as needed
];

// Function to render articles
function renderArticles(articles: Article[]): void {
  const articlesListElement = document.getElementById('articles-list');

  if (articlesListElement) {
    articlesListElement.innerHTML = articles.map(article => `
      <article class="article">
        <h2>${article.title}</h2>
        <div class="article-content">${marked.parse(article.content)}</div>
      </article>
    `).join('');
  }
}

// Call the function to render articles
renderArticles(articles);
