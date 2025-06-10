// src/components/ArticleDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { articleDetailRepository } from './Repository/ArticleDetailRepository';
import type { Article } from './Repository/ArticleDetailRepository';

export const ArticleDetail: React.FC = () => {
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

  if (loading) return <div>Loading article...</div>;
  if (!article) return <div>Article not found</div>;

  return (
    <article className="article-detail">
      <header>
        <h1>{article.title}</h1>
        <time dateTime={article.created_at}>
          {new Date(article.created_at).toLocaleDateString()}
        </time>
      </header>
      
      <div className="article-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {article.content}
        </ReactMarkdown>
      </div>
      
      {article.tags && (
        <footer className="article-tags">
          {article.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </footer>
      )}
    </article>
  );
};