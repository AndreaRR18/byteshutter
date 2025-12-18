import React from "react";
import { Tag } from "../../../components/Tag/Tag";
import { Divider } from "../../../components/Divider/Divider";
import styles from "./PostCard.module.css";

interface PostCardProps {
  title: string;
  excerpt: string;
  date?: string;
  tags?: string[];
}

export const PostCard = React.memo<PostCardProps>(
  ({ title, excerpt, date, tags }) => {
    return (
      <article className={styles.card}>
      <div className={styles.content}>
        {date && (
          <time className={styles.date}>
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}

        <h2 className={styles.title}>{title}</h2>

        <p className={styles.excerpt}>{excerpt}</p>

        {tags && tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag, index) => (
              <Tag key={index} text={tag} />
            ))}
          </div>
        )}

        <Divider thickness="medium" spacing="large" color={styles.divider} />
      </div>
    </article>
  );
},
);
