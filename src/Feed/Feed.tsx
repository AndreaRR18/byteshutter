import React from 'react';
import styles from './Feed.module.css';
import type { ArticleFeed } from './ArticleFeed.ts';

const Feed: React.FC = () => {
const articles: ArticleFeed[] = [
  {
    title: "Responsive Web Design Basics",
    cover_image: "/resources/images/minimal-static-site.jpg",
    excerpt: "A quick primer on making your site look great on any device.",
    created: "2024-05-10"
  },
  {
    title: "Introduction to JavaScript",
    cover_image: "/resources/images/javascript-intro.jpg",
    excerpt: "Learn the fundamentals of JavaScript programming.",
    created: "2024-05-11"
  },
  {
    title: "CSS Flexbox Guide",
    cover_image: "/resources/images/css-flexbox.jpg",
    excerpt: "Master CSS Flexbox for modern web layouts.",
    created: "2024-05-12"
  },
  {
    title: "Understanding React Hooks",
    cover_image: "/resources/images/react-hooks.jpg",
    excerpt: "Dive into React Hooks and state management.",
    created: "2024-05-13"
  },
  {
    title: "Advanced Git Commands",
    cover_image: "/resources/images/advanced-git.jpg",
    excerpt: "Explore advanced Git commands for better version control.",
    created: "2024-05-14"
  },
  {
    title: "Building RESTful APIs",
    cover_image: "/resources/images/restful-apis.jpg",
    excerpt: "Learn how to build and consume RESTful APIs.",
    created: "2024-05-15"
  },
  {
    title: "Web Performance Optimization",
    cover_image: "/resources/images/web-performance.jpg",
    excerpt: "Techniques to optimize your website's performance.",
    created: "2024-05-16"
  },
  {
    title: "Getting Started with TypeScript",
    cover_image: "/resources/images/typescript-intro.jpg",
    excerpt: "An introduction to TypeScript and its benefits.",
    created: "2024-05-17"
  },
  {
    title: "Deploying with Docker",
    cover_image: "/resources/images/docker-deploy.jpg",
    excerpt: "Learn how to deploy applications using Docker.",
    created: "2024-05-18"
  },
  {
    title: "Introduction to GraphQL",
    cover_image: "/resources/images/graphql-intro.jpg",
    excerpt: "Understand the basics of GraphQL and its advantages.",
    created: "2024-05-19"
  }
];

  return (
    <div className={styles.feed}>
      {articles.map((article, index) => (
        <article key={index} className={styles.article}>
          <img 
            src={article.cover_image} 
            alt={article.title}
            className={styles.coverImage}
          />
          <div className={styles.content}>
            <h2 className={styles.title}>{article.title}</h2>
            <p className={styles.excerpt}>{article.excerpt}</p>
            <time className={styles.date}>{article.created}</time>
          </div>
        </article>
      ))}
    </div>
  );
};

export default Feed;