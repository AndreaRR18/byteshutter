import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { ArticleFeed } from './BlogListRepository';
import { feedRepository } from './BlogListRepository';
import './BlogList.css';

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

  if (loading) {
    return (
      <div className="blog-list-container">
        <div className="loading-skeleton">
          <div className="skeleton-title"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton-article">
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
              <div className="skeleton-date"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="blog-list-container">
        <div className="error-state">
          <h2>Unable to load articles</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (!feed || feed.articles.length === 0) {
    return (
      <div className="blog-list-container">
        <div className="empty-state">
          <h2>No articles yet</h2>
          <p>Check back soon for new content!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-list-container">
      <header className="blog-list-header">
        <h1>Articles</h1>
        <p className="blog-list-description">
          Thoughts on code, design, and building things that matter
        </p>
      </header>
      
      <div className="articles-grid">
        {feed.articles.map((article) => (
          <article key={article.slug} className="article-card">
            <Link to={`/articles/${article.slug}`} className="article-link">
              <div className="article-content">
                <h2 className="article-title">{article.title}</h2>
                
                <div className="article-meta">
                  <time 
                    className="article-date" 
                    dateTime={article.created_at}
                  >
                    {new Date(article.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                
                {article.excerpt && (
                  <p className="article-excerpt">{article.excerpt}</p>
                )}
                
                {article.tags && article.tags.length > 0 && (
                  <div className="article-tags">
                    {article.tags.map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogList;