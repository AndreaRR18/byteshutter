import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Feed.module.css';
import type { ArticleFeed } from './Repository/FeedRepository';
import { feedRepository } from './Repository/FeedRepository';

const Feed: React.FC = () => {
  const [feed, setFeed] = useState<ArticleFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
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

  if (loading) return <div className={styles.loading}>Loading articles...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!feed) return <div className={styles.empty}>No articles found</div>;

  return (
    <div className={styles.feed}>
      {feed.articles.map((article) => (
        <article key={article.slug} className={styles.article}>
          <div className={styles.content}>
            <h2 className={styles.title}>
              <Link to={`/articles/${article.slug}`}>
                {article.title}
              </Link>
            </h2>
            <time className={styles.date} dateTime={article.created_at}>
              {new Date(article.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {article.excerpt && (
              <p className={styles.excerpt}>{article.excerpt}</p>
            )}
            {article.tags && article.tags.length > 0 && (
              <div className={styles.tags}>
                {article.tags.map(tag => (
                  <span key={tag} className={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
};

export default Feed;