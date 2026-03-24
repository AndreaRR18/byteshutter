/* Articles list for ByteShutter */

interface ArticleFeed {
  title: string;
  excerpt: string;
  created_at: string;
  slug: string;
  tags?: string[];
}

interface ArticlesFeedResponse {
  articles: ArticleFeed[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function buildTagsHtml(tags: string[] | undefined): string {
  if (!tags || tags.length === 0) return '';
  return tags.map(function (t: string): string {
    return '<span class="tag">' + t + '</span>';
  }).join('');
}

function buildCard(article: ArticleFeed): string {
  const kickerTag = article.tags && article.tags.length > 0
    ? article.tags[0].toUpperCase()
    : '';
  const tagsHtml = buildTagsHtml(article.tags);
  const dateStr = article.created_at ? formatDate(article.created_at) : '';
  return '<a href="./article.html#' + article.slug + '" class="post-card-link">' +
    '<article class="post-card">' +
      (kickerTag ? '<span class="post-kicker">' + kickerTag + '</span>' : '') +
      '<h2 class="post-title">' + article.title + '</h2>' +
      '<p class="post-excerpt">' + article.excerpt + '</p>' +
      '<div class="post-meta">' +
        '<time class="post-date" datetime="' + (article.created_at || '') + '">' + dateStr + '</time>' +
        (tagsHtml ? '<div class="post-tags">' + tagsHtml + '</div>' : '') +
      '</div>' +
    '</article>' +
  '</a>';
}

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
    const res = await fetch('./data/articles.json');
    if (!res.ok) throw new Error('Failed to load articles (' + res.status + ')');
    const data: ArticlesFeedResponse = await res.json();
    const articles = data.articles || [];

    if (articles.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No articles yet.</p></div>';
      return;
    }

    container.innerHTML = articles.map(buildCard).join('');
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'An unexpected error occurred.';
    container.innerHTML =
      '<div class="error-state">' +
        '<h2>Failed to load articles</h2>' +
        '<p>' + msg + '</p>' +
      '</div>';
  }
}

document.addEventListener('DOMContentLoaded', loadArticles);

export {};
