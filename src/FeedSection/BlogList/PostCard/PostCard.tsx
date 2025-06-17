import React from 'react';
import { Tag } from '../../../components/Tag/Tag';
import styles from './PostCard.module.css';

interface PostCardProps {
  title: string;
  excerpt: string;
  date?: string;
  tags?: string[];
  onClick?: () => void;
}
 
export const PostCard: React.FC<PostCardProps> = ({
  title,
  excerpt,
  date,
  tags,
  onClick
}) => {
  return (
    <article className={styles.card} onClick={onClick}>
      <div className={styles.content}>
        {date && (
          <time className={styles.date}>{date}</time>
        )}
        
        <h2 className={styles.title}>{title}</h2>
        
        <p className={styles.excerpt}>
          {excerpt}
          {' '}
          <span className={styles.readMore}>Read more »</span>
        </p>
        
        {tags && tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag, index) => (
              <Tag key={index} text={tag} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
};