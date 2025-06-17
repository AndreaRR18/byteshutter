import React from 'react';
import styles from './PostCard.module.css';

interface PostCardProps {
  title: string;
  excerpt: string;
  category?: string;
  author?: string;
  date?: string;
  readTime?: string;
  tags?: string[];
  featured?: boolean;
  onClick?: () => void;
}
 
export const PostCard: React.FC<PostCardProps> = ({
  title,
  excerpt,
  category,
  author,
  date,
  readTime,
  tags,
  featured = false,
  onClick
}) => {
  const cardClass = featured ? styles.cardFeatured : styles.card;

  return (
    <article className={cardClass} onClick={onClick}>
      
      <div className={styles.content}>
        <header className={styles.header}>
          {category && (
            <span className={styles.category}>{category}</span>
          )}
          <h3 className={styles.title}>{title}</h3>
        </header>
        
        <p className={styles.excerpt}>{excerpt}</p>
        
        {tags && tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <footer className={styles.footer}>
          <div className={styles.meta}>
            {author && (
              <div className={styles.author}>
                <div className={styles.authorAvatar}></div>
                <span className={styles.authorName}>{author}</span>
              </div>
            )}
            {date && (
              <div className={styles.date}>
                <span className={styles.metaIcon}>📅</span>
                <span>{date}</span>
              </div>
            )}
            {readTime && (
              <div className={styles.readTime}>
                <span className={styles.metaIcon}>⏱️</span>
                <span>{readTime}</span>
              </div>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
};