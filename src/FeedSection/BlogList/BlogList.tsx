import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { ArticleFeed } from "./BlogListRepository";
import { feedRepository } from "./BlogListRepository";
import { getErrorMessage } from "../../types/errors";
import "./BlogList.module.css";
import { PostCard } from "./PostCard/PostCard";

type FeedState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; feed: ArticleFeed };

const BlogList: React.FC = () => {
  const [state, setState] = useState<FeedState>({ status: "loading" });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articles = await feedRepository.getArticles();
        setState({ status: "success", feed: articles });
      } catch (err) {
        setState({ status: "error", error: getErrorMessage(err) });
      }
    };

    fetchArticles();
  }, []);

  if (state.status === "loading") {
    return (
      <div className="blog-container">
        <section className="content-section">
          <div className="loading-skeleton">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
                <div className="skeleton-date"></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="blog-container">
        <section className="content-section">
          <div className="error-state">
            <h2>Unable to load articles</h2>
            <p>{state.error}</p>
          </div>
        </section>
      </div>
    );
  }

  if (state.status === "success" && state.feed.articles.length === 0) {
    return (
      <div className="blog-container">
        <section className="content-section">
          <div className="empty-state">
            <h2>No articles yet</h2>
            <p>Check back soon for new content!</p>
          </div>
        </section>
      </div>
    );
  }

  // TypeScript knows state.status === "success" here
  const { feed } = state;

  return (
    <div className="blog-container">
      <section className="content-section">
        <div className="articles-list">
          {feed.articles.map((article) => (
            <Link to={`/articles/${article.slug}`} key={article.slug}>
              <PostCard
                title={article.title}
                excerpt={article.excerpt}
                date={article.created_at}
                tags={article.tags}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogList;
