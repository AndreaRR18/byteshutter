/* Articles list for ByteShutter */

import { escapeHtml, fetchArticleFeed, frameNumbers, renderFrameRow } from './feed.js';

function showSkeleton(container: HTMLElement): void {
  container.innerHTML =
    '<div class="loading-skeleton">' +
      '<div class="skeleton-card"><div class="skeleton-title"></div><div class="skeleton-text"></div><div class="skeleton-text short"></div><div class="skeleton-date"></div></div>' +
      '<div class="skeleton-card"><div class="skeleton-title"></div><div class="skeleton-text"></div><div class="skeleton-text short"></div><div class="skeleton-date"></div></div>' +
      '<div class="skeleton-card"><div class="skeleton-title"></div><div class="skeleton-text"></div><div class="skeleton-text short"></div><div class="skeleton-date"></div></div>' +
    '</div>';
}

async function loadArticles(): Promise<void> {
  const container = document.getElementById('articles-list');
  if (!container) return;

  showSkeleton(container);

  try {
    const articles = await fetchArticleFeed();

    if (articles.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No articles yet.</p></div>';
      return;
    }

    const numbers = frameNumbers(articles);
    container.innerHTML = articles.map(function (article): string {
      return renderFrameRow(article, numbers.get(article.slug) ?? 0, 2);
    }).join('');
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'An unexpected error occurred.';
    container.innerHTML =
      '<div class="error-state">' +
        '<h2>Failed to load articles</h2>' +
        '<p>' + escapeHtml(msg) + '</p>' +
      '</div>';
  }
}

document.addEventListener('DOMContentLoaded', loadArticles);

export {};
