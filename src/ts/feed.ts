/* Shared article-feed helpers for ByteShutter (home, articles list, article detail) */

export interface ArticleFeed {
  title: string;
  excerpt: string;
  created_at: string;
  slug: string;
  tags?: string[];
}

interface ArticlesFeedResponse {
  articles: ArticleFeed[];
}

function timeOf(article: ArticleFeed): number {
  return Date.parse(article.created_at) || 0;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Loads data/articles.json, newest article first. */
export async function fetchArticleFeed(): Promise<ArticleFeed[]> {
  const res = await fetch('./data/articles.json');
  if (!res.ok) throw new Error('Failed to load articles (' + res.status + ')');
  const data: ArticlesFeedResponse = await res.json();
  return (data.articles || []).slice().sort(function (a: ArticleFeed, b: ArticleFeed): number {
    return timeOf(b) - timeOf(a);
  });
}

/** Frame number per slug: the oldest article is 1, numbered by created_at ascending. */
export function frameNumbers(articles: ArticleFeed[]): Map<string, number> {
  const numbers = new Map<string, number>();
  articles
    .slice()
    .sort(function (a: ArticleFeed, b: ArticleFeed): number { return timeOf(a) - timeOf(b); })
    .forEach(function (article: ArticleFeed, index: number): void {
      numbers.set(article.slug, index + 1);
    });
  return numbers;
}

export function frameLabel(n: number): string {
  return 'No. ' + String(n).padStart(2, '0');
}

/** "06 MAY 2020" — formatted in UTC so the day never shifts with the visitor's timezone. */
export function formatShortDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
    .toUpperCase();
}

export function renderFrameRow(article: ArticleFeed, number: number, headingLevel: 2 | 3): string {
  const tag = article.tags && article.tags.length > 0 ? article.tags[0] : '';
  const date = article.created_at ? formatShortDate(article.created_at) : '';
  const meta = [tag, date].filter(Boolean).map(escapeHtml).join(' · ');
  const h = 'h' + headingLevel;
  return '<a href="./article.html#' + article.slug + '" class="frame-row vf vf-hover">' +
    '<span class="frame-no">' + frameLabel(number) + '</span>' +
    '<div class="frame-body">' +
      (meta ? '<p class="label">' + meta + '</p>' : '') +
      '<' + h + ' class="frame-title">' + escapeHtml(article.title) + '</' + h + '>' +
      '<p class="frame-excerpt">' + escapeHtml(article.excerpt) + '</p>' +
    '</div>' +
    '<span class="frame-arrow" aria-hidden="true">→</span>' +
  '</a>';
}

export function renderEmptyFrameRow(number: number): string {
  return '<div class="frame-row frame-row--empty">' +
    '<span class="frame-no">' + frameLabel(number) + '</span>' +
    '<div class="frame-body"><p class="frame-title">Next frame is in the developing tray.</p></div>' +
  '</div>';
}
