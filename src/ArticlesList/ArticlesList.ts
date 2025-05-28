// Define the structure of an article
export interface Article {
    id: number;
    title: string;
    content: string;
}

// Sample data
const articles: Article[] = [
    { id: 1, title: 'Article 1', content: 'Content for Article 1' },
    { id: 2, title: 'Article 2', content: 'Content for Article 2' },
    // Add more articles as needed
];

// Function to render articles
export function renderArticles(container: HTMLElement): void {
    container.innerHTML = articles.map(article => `
        <article>
            <h2>${article.title}</h2>
            <p>${article.content}</p>
        </article>
    `).join('');
}