/* Article detail for ByteShutter
 * marked.min.js is loaded as a classic (non-module) script in article.html,
 * which guarantees it executes before any deferred module scripts (including this one).
 * Do NOT add type="module" to the marked.min.js script tag in article.html.
 */

import { escapeHtml, fetchArticleFeed, formatShortDate, frameLabel, frameNumbers } from './feed.js';

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

function buildTagsHtml(tags: string[] | undefined): string {
  if (!tags || tags.length === 0) return '';
  return tags.map(function (t: string): string {
    return '<span class="tag">' + escapeHtml(t) + '</span>';
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

/** "No. 01" for this article, or '' if the feed cannot be loaded. */
async function resolveFrameLabel(slug: string): Promise<string> {
  try {
    const number = frameNumbers(await fetchArticleFeed()).get(slug);
    return number === undefined ? '' : frameLabel(number);
  } catch {
    return '';
  }
}

/** Puts the code language (from marked's language-* class) on the <pre> for the CSS label. */
function labelCodeBlocks(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('pre > code').forEach(function (code: HTMLElement): void {
    const match = /(?:^|\s)language-([\w+#-]+)/.exec(code.className);
    const pre = code.parentElement;
    if (match && pre) pre.setAttribute('data-lang', match[1]);
  });
}

/** Wraps each image in <figure><div class="vf">…</div><figcaption>…</figcaption></figure>. */
function frameImages(root: HTMLElement): void {
  root.querySelectorAll<HTMLImageElement>('img').forEach(function (img: HTMLImageElement): void {
    const caption = img.getAttribute('title') || img.getAttribute('alt') || '';
    const parent = img.parentElement;
    const onlyChild =
      parent !== null &&
      parent.tagName === 'P' &&
      parent.children.length === 1 &&
      (parent.textContent || '').trim() === '';
    const host: Element = onlyChild && parent ? parent : img;

    const figure = document.createElement('figure');
    figure.className = 'article-figure';
    const frame = document.createElement('div');
    frame.className = 'vf';

    host.replaceWith(figure);
    img.loading = 'lazy';
    frame.appendChild(img);
    figure.appendChild(frame);

    if (caption) {
      const figcaption = document.createElement('figcaption');
      figcaption.className = 'label';
      figcaption.textContent = caption;
      figure.appendChild(figcaption);
    }
  });
}

async function loadArticle(): Promise<void> {
  const slug = window.location.hash.slice(1);

  if (!slug) {
    showError('No article slug specified.');
    return;
  }

  try {
    const [res, frame] = await Promise.all([
      fetch('./data/' + encodeURIComponent(slug) + '.json'),
      resolveFrameLabel(slug)
    ]);
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
      dateEl.textContent = formatShortDate(article.created_at);
      dateEl.setAttribute('datetime', article.created_at);
    }

    const readTimeEl = document.getElementById('article-read-time');
    if (readTimeEl) readTimeEl.textContent = readTime + ' min read';

    const kickerEl = document.getElementById('article-kicker');
    if (kickerEl) {
      const kickerTag = article.tags && article.tags.length > 0 ? article.tags[0] : '';
      kickerEl.textContent = [frame, kickerTag].filter(Boolean).join(' · ');
    }

    const tagsEl = document.getElementById('article-tags');
    if (tagsEl) tagsEl.innerHTML = buildTagsHtml(article.tags);

    const bodyEl = document.getElementById('article-body');
    if (bodyEl && article.content) {
      bodyEl.innerHTML = marked.parse(article.content, { gfm: true, breaks: false });
      labelCodeBlocks(bodyEl);
      frameImages(bodyEl);
    }

  } catch (e) {
    showError(e instanceof Error ? e.message : 'Failed to load article.');
  }
}

document.addEventListener('DOMContentLoaded', loadArticle);

export {};
