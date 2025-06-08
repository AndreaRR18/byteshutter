import type { ArticleFeed } from './ArticleFeed';

export class FeedRepository {
    async getArticles(): Promise<ArticleFeed> {
        const response = await fetch('./src/database/articles.json');

        if (!response.ok) {
            throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
        }

        const data: ArticleFeed = await response.json();
        return data;
    }
}