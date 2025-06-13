// src/components/ArticleDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { articleDetailRepository } from './BlogPostRepository';
import type { Article } from './BlogPostRepository';
import './BlogPost.css';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    if (slug) {
      articleDetailRepository.getArticleBySlug(slug)
        .then(setArticle)
        .finally(() => setLoading(false));
    }
  }, [slug]);

  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  if (loading) {
    return (
      <div className="blog-post-container">
        <div className="reading-progress-bar">
          <div className="reading-progress" style={{ width: '0%' }}></div>
        </div>
        
        <div className="loading-skeleton">
          <div className="skeleton-header">
            <div className="skeleton-title"></div>
            <div className="skeleton-meta"></div>
          </div>
          <div className="skeleton-content">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-paragraph">
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="blog-post-container">
        <div className="article-not-found">
          <h1>Article not found</h1>
          <p>The article you're looking for doesn't exist or has been moved.</p>
          <Link to="/articles" className="back-link">
            ← Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  const estimatedReadTime = Math.ceil(article.content.split(' ').length / 200);

  return (
    <div className="blog-post-container">
      <div className="reading-progress-bar">
        <div 
          className="reading-progress" 
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      <article className="article-detail">
        <header className="article-header">
          <h1 className="article-title">{article.title}</h1>
          
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
            <span className="read-time">{estimatedReadTime} min read</span>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="article-tags">
              {article.tags.map(tag => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
          )}
        </header>
        
        <div className="article-content">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="content-h1">{children}</h1>,
              h2: ({ children }) => <h2 className="content-h2">{children}</h2>,
              h3: ({ children }) => <h3 className="content-h3">{children}</h3>,
              h4: ({ children }) => <h4 className="content-h4">{children}</h4>,
              p: ({ children }) => <p className="content-p">{children}</p>,
              code: ({ children, className }) => {
                const isInline = !className;
                return isInline 
                  ? <code className="inline-code">{children}</code>
                  : <code className={className}>{children}</code>;
              },
              pre: ({ children }) => <pre className="code-block">{children}</pre>,
              blockquote: ({ children }) => <blockquote className="blockquote">{children}</blockquote>,
              ul: ({ children }) => <ul className="content-ul">{children}</ul>,
              ol: ({ children }) => <ol className="content-ol">{children}</ol>,
              li: ({ children }) => <li className="content-li">{children}</li>,
              a: ({ href, children }) => (
                <a href={href} className="content-link" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        <footer className="article-footer">
          <div className="footer-tags">
            <span className="tags-label">Tagged with:</span>
            {article.tags?.map(tag => (
              <span key={tag} className="footer-tag">#{tag}</span>
            ))}
          </div>
          
          <div className="article-actions">
            <Link to="/" className="back-to-articles">
              ← More Articles
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
};