// src/components/ArticleDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
        <time dateTime={article.date}>
          {new Date(article.date).toLocaleDateString()}
        </time>
      </header>
      
      <div 
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />
      
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