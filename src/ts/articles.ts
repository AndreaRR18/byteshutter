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

function getTagBgColor(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const hue = Math.abs(hash) % 360;
  return 'hsl(' + hue + ', 65%, 85%)';
}

function getTagTextColor(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const hue = Math.abs(hash) % 360;
  return 'hsl(' + hue + ', 65%, 35%)';
}

function buildTagsHtml(tags: string[] | undefined): string {
  if (!tags || tags.length === 0) return '';
  return tags.map(function (t: string): string {
    const bg = getTagBgColor(t);
    const fg = getTagTextColor(t);
    return '<span class="tag" style="background-color:' + bg + ';color:' + fg + ';border-color:' + fg + '">#' + t + '</span>';
  }).join('');
}

function buildCard(article: ArticleFeed): string {
  const tagsHtml = buildTagsHtml(article.tags);
  const dateStr = article.created_at ? formatDate(article.created_at) : '';
  return '<a href="./article.html#' + article.slug + '" class="post-card-link">' +
    '<article class="post-card">' +
      '<time class="post-date" datetime="' + (article.created_at || '') + '">' + dateStr + '</time>' +
      '<h2 class="post-title">' + article.title + '</h2>' +
      '<p class="post-excerpt">' + article.excerpt + '</p>' +
      (tagsHtml ? '<div class="post-tags">' + tagsHtml + '</div>' : '') +
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
