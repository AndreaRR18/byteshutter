/* Article detail for ByteShutter - requires marked.js loaded before this script */

// marked v15+ API: options are passed directly to parse(), setOptions() is removed
declare const marked: {
  parse(src: string, options?: { gfm?: boolean; breaks?: boolean }): string;
};

interface ArticleDetail {
  title: string;
  excerpt?: string;
  created_at: string;
  slug: string;
  tags?: string[];
  content: string;
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

function showError(msg: string): void {
  const skeleton = document.getElementById('article-skeleton');
  const errorEl = document.getElementById('article-error');
  const errorMsg = document.getElementById('article-error-msg');
  if (skeleton) skeleton.style.display = 'none';
  if (errorEl) errorEl.style.display = 'block';
  if (errorMsg) errorMsg.textContent = msg;
}

function injectStructuredData(article: ArticleDetail): void {
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.text = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    datePublished: article.created_at,
    author: { '@type': 'Person', name: 'Andrea Rinaldi' },
    keywords: (article.tags || []).join(',')
  });
  document.head.appendChild(ld);
}

async function loadArticle(): Promise<void> {
  const slug = window.location.hash.slice(1);

  if (!slug) {
    showError('No article slug specified.');
    return;
  }

  try {
    const res = await fetch('./data/' + encodeURIComponent(slug) + '.json');
    if (!res.ok) throw new Error('Article not found (' + res.status + ')');
    const article: ArticleDetail = await res.json();

    document.title = article.title + ' | ByteShutter';
    const metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (metaDesc && article.excerpt) metaDesc.setAttribute('content', article.excerpt);

    injectStructuredData(article);

    const words = article.content ? article.content.split(/\s+/).filter(Boolean).length : 0;
    const readTime = Math.max(1, Math.round(words / 200));

    const skeleton = document.getElementById('article-skeleton');
    const content = document.getElementById('article-content-wrapper');
    if (skeleton) skeleton.style.display = 'none';
    if (content) content.style.display = 'block';

    const titleEl = document.getElementById('article-title');
    if (titleEl) titleEl.textContent = article.title;

    const dateEl = document.getElementById('article-date');
    if (dateEl && article.created_at) {
      dateEl.textContent = formatDate(article.created_at);
      dateEl.setAttribute('datetime', article.created_at);
    }

    const readTimeEl = document.getElementById('article-read-time');
    if (readTimeEl) readTimeEl.textContent = readTime + ' min read';

    const tagsEl = document.getElementById('article-tags');
    if (tagsEl) tagsEl.innerHTML = buildTagsHtml(article.tags);

    const bodyEl = document.getElementById('article-body');
    if (bodyEl && article.content) {
      bodyEl.innerHTML = marked.parse(article.content, { gfm: true, breaks: false });
    }

  } catch (e) {
    showError(e instanceof Error ? e.message : 'Failed to load article.');
  }
}

document.addEventListener('DOMContentLoaded', loadArticle);

export {};
