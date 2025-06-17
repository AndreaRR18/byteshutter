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


  useEffect(() => {
    if (slug) {
      articleDetailRepository.getArticleBySlug(slug)
        .then(setArticle)
        .finally(() => setLoading(false));
    }
  }, [slug]);



  if (loading) {
    return (
      <div className="article-container">
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