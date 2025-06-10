import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { ArticleFeed } from './BlogListRepository';
import { feedRepository } from './BlogListRepository';

const BlogList: React.FC = () => {
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

  if (loading) return <div>Loading articles...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!feed) return <div>No articles found</div>;

  return (
    <div>
      <h2>Articles</h2>
      <ul>
        {feed.articles.map((article) => (
          <li key={article.slug}>
            <h3>
              <Link to={`/articles/${article.slug}`}>
                {article.title}
              </Link>
            </h3>
            <time>
              {new Date(article.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {article.excerpt && <p>{article.excerpt}</p>}
            {article.tags && article.tags.length > 0 && (
              <div>
                {article.tags.map(tag => (
                  <span key={tag}>#{tag} </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;