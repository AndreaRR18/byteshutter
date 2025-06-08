import React, { useState, useEffect } from 'react';
import styles from './Feed.module.css';
import type { ArticleFeed } from './ArticleFeed.ts';
import { FeedRepository } from './FeedRepository.ts';

const Feed: React.FC = () => {
  const [feed, setFeed] = useState<ArticleFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const feedRepository = new FeedRepository();
    const fetchArticles = async () => {
      try {
        const articles = await feedRepository.getArticles();
        setFeed(articles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div>Loading articles...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!feed) return <div>No articles found</div>;

  return (
    <div className={styles.feed}>
      {feed.articles.map((article, index) => (
        <article key={index} className={styles.article}>
          <div className={styles.content}>
            <h2 className={styles.title}>{article.title}</h2>
            <p className={styles.excerpt}>{article.excerpt}</p>
            <time className={styles.date}>{article.created_at}</time>
          </div>
        </article>
      ))}
    </div>
  );
};

export default Feed;