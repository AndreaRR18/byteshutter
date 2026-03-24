/* Article detail for ByteShutter - requires marked.js loaded before this script */

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getTagBgColor(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const hue = Math.abs(hash) % 360;
  return 'hsl(' + hue + ', 65%, 85%)';
}

function getTagTextColor(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const hue = Math.abs(hash) % 360;
  return 'hsl(' + hue + ', 65%, 35%)';
}

function buildTagsHtml(tags) {
  if (!tags || tags.length === 0) return '';
  return tags.map(function(t) {
    var bg = getTagBgColor(t);
    var fg = getTagTextColor(t);
    return '<span class="tag" style="background-color:' + bg + ';color:' + fg + ';border-color:' + fg + '">#' + t + '</span>';
  }).join('');
}

function showError(msg) {
  var skeleton = document.getElementById('article-skeleton');
  var errorEl = document.getElementById('article-error');
  var errorMsg = document.getElementById('article-error-msg');
  if (skeleton) skeleton.style.display = 'none';
  if (errorEl) errorEl.style.display = 'block';
  if (errorMsg) errorMsg.textContent = msg;
}

function injectStructuredData(article) {
  var ld = document.createElement('script');
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

async function loadArticle() {
  var params = new URLSearchParams(window.location.search);
  var slug = params.get('slug');

  if (!slug) {
    showError('No article slug specified.');
    return;
  }

  try {
    var res = await fetch('./data/' + encodeURIComponent(slug) + '.json');
    if (!res.ok) throw new Error('Article not found (' + res.status + ')');
    var article = await res.json();

    // Update page title and meta description
    document.title = article.title + ' | ByteShutter';
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && article.excerpt) metaDesc.setAttribute('content', article.excerpt);

    // Inject structured data for SEO
    injectStructuredData(article);

    // Compute estimated read time
    var words = article.content ? article.content.split(/\s+/).filter(Boolean).length : 0;
    var readTime = Math.max(1, Math.round(words / 200));

    // Hide skeleton, show content
    var skeleton = document.getElementById('article-skeleton');
    var content = document.getElementById('article-content-wrapper');
    if (skeleton) skeleton.style.display = 'none';
    if (content) content.style.display = 'block';

    // Populate fields
    var titleEl = document.getElementById('article-title');
    if (titleEl) titleEl.textContent = article.title;

    var dateEl = document.getElementById('article-date');
    if (dateEl && article.created_at) {
      dateEl.textContent = formatDate(article.created_at);
      dateEl.setAttribute('datetime', article.created_at);
    }

    var readTimeEl = document.getElementById('article-read-time');
    if (readTimeEl) readTimeEl.textContent = readTime + ' min read';

    var tagsEl = document.getElementById('article-tags');
    if (tagsEl) tagsEl.innerHTML = buildTagsHtml(article.tags);

    // Render markdown
    var bodyEl = document.getElementById('article-body');
    if (bodyEl && article.content) {
      marked.setOptions({ gfm: true, breaks: false });
      bodyEl.innerHTML = marked.parse(article.content);
    }

  } catch (e) {
    showError(e.message || 'Failed to load article.');
  }
}

document.addEventListener('DOMContentLoaded', loadArticle);
