// src/components/ArticleDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Tag } from '../../components/Tag/Tag';
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
    let animationFrameId: number | null = null;
    let lastProgress = 0;
    
    const updateReadingProgress = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      animationFrameId = requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        if (docHeight > 0) {
          const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
          
          // Only update if progress has changed significantly to reduce re-renders
          if (Math.abs(progress - lastProgress) > 0.1) {
            setReadingProgress(Math.round(progress * 10) / 10); // Round to 1 decimal place
            lastProgress = progress;
          }
        }
        
        animationFrameId = null;
      });
    };

    // Initial calculation with a small delay to ensure DOM is ready
    const initialTimeout = setTimeout(updateReadingProgress, 100);
    
    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    window.addEventListener('resize', updateReadingProgress, { passive: true });
    
    return () => {
      clearTimeout(initialTimeout);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('scroll', updateReadingProgress);
      window.removeEventListener('resize', updateReadingProgress);
    };
  }, []);

  if (loading) {
    return (
      <div className="article-container">
        <div className="reading-progress-bar">
          <div className="reading-progress" style={{ width: '0%' }}></div>
        </div>
        
        <div className="article-content">
          <div className="loading-skeleton">
            <div className="skeleton-header">
              <div className="skeleton-title"></div>
              <div className="skeleton-meta"></div>
            </div>
            <div className="skeleton-content">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-paragraph">
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-container">
        <div className="article-content">
          <div className="article-not-found">
            <h1>Article not found</h1>
            <p>The article you're looking for doesn't exist or has been moved.</p>
            <Link to="/" className="back-link">
              ← Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const estimatedReadTime = Math.ceil(article.content.split(' ').length / 200);

  return (
    <div className="article-container">
      <div className="reading-progress-bar">
        <div 
          className="reading-progress" 
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      <div className="article-content">
        <article className="article">
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
                {article.tags.map((tag, index) => (
                  <Tag key={index} text={tag} />
                ))}
              </div>
            )}
          </header>
          
          <div className="article-body">
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
                img: ({ src, alt }) => (
                  <img 
                    src={src} 
                    alt={alt || ''} 
                    className="content-img"
                    loading="lazy"
                    onError={(e) => {
                      console.warn('Image failed to load:', src);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          <footer className="article-footer">
            <Link to="/" className="back-to-articles">
              ← More Articles
            </Link>
          </footer>
        </article>
      </div>
    </div>
  );
};