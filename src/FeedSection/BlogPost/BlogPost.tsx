// src/components/ArticleDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { articleDetailRepository } from "./BlogPostRepository";
import type { Article } from "./BlogPostRepository";
import styles from "./BlogPost.module.css";
import { Tag } from "../../components/Tag/Tag";

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      articleDetailRepository
        .getArticleBySlug(slug)
        .then(setArticle)
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.blogContainer}>
        <div className={styles.contentSection}>
          <div className={styles.loadingSkeleton}>
            <div className={styles.skeletonCard}>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonDate}></div>
            </div>
            <div className={styles.skeletonCard}>
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className={styles.skeletonText}></div>
                  <div className={styles.skeletonText}></div>
                  <div
                    className={`${styles.skeletonText} ${styles.short}`}
                  ></div>
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
      <div className={styles.blogContainer}>
        <div className={styles.contentSection}>
          <div className={styles.errorState}>
            <h2>Article not found</h2>
            <p>
              The article you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className={styles.articleLink}>
              ← Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const estimatedReadTime = Math.ceil(article.content.split(" ").length / 200);

  return (
    <div className={styles.blogContainer}>
      <div className={styles.contentSection}>
        <article className={styles.articleCard}>
          <header className={styles.articleHeader}>
            <h1 className={styles.articleTitle}>{article.title}</h1>

            <div className={styles.articleMeta}>
              <time
                className={styles.articleDate}
                dateTime={article.created_at}
              >
                {new Date(article.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className={styles.articleDate}>
                {" "}
                · {estimatedReadTime} min read
              </span>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div>
                {article.tags.map((tag, index) => (
                  <Tag key={index} text={tag} />
                ))}
              </div>
            )}
          </header>

          <div className={styles.articleExcerpt}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1>{children}</h1>,
                h2: ({ children }) => <h2>{children}</h2>,
                h3: ({ children }) => <h3>{children}</h3>,
                h4: ({ children }) => <h4>{children}</h4>,
                p: ({ children }) => <p>{children}</p>,
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code>{children}</code>
                  ) : (
                    <code className={className}>{children}</code>
                  );
                },
                pre: ({ children }) => <pre>{children}</pre>,
                blockquote: ({ children }) => (
                  <blockquote>{children}</blockquote>
                ),
                ul: ({ children }) => <ul>{children}</ul>,
                ol: ({ children }) => <ol>{children}</ol>,
                li: ({ children }) => <li>{children}</li>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className={styles.articleLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => {
                  let imageSrc = src;
                  if (src?.startsWith("/images/")) {
                    imageSrc = import.meta.env.BASE_URL + src.substring(1);
                  } else if (src?.startsWith("/")) {
                    imageSrc = import.meta.env.BASE_URL + src.substring(1);
                  }

                  return (
                    <img
                      src={imageSrc}
                      alt={alt || ""}
                      loading="lazy"
                      onError={(e) => {
                        console.warn("Image failed to load:", imageSrc);
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  );
                },
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          <footer>
            <Link to="/articles" className={styles.articleLink}>
              ← More Articles
            </Link>
          </footer>
        </article>
      </div>
    </div>
  );
};
