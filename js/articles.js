/* Articles list for ByteShutter */

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

function buildCard(article) {
  var tagsHtml = buildTagsHtml(article.tags);
  var dateStr = article.created_at ? formatDate(article.created_at) : '';
  return '<a href="./article.html#' + article.slug + '" class="post-card-link">' +
    '<article class="post-card">' +
      '<time class="post-date" datetime="' + (article.created_at || '') + '">' + dateStr + '</time>' +
      '<h2 class="post-title">' + article.title + '</h2>' +
      '<p class="post-excerpt">' + article.excerpt + '</p>' +
      (tagsHtml ? '<div class="post-tags">' + tagsHtml + '</div>' : '') +
    '</article>' +
  '</a>';
}

function showSkeleton(container) {
  container.innerHTML =
    '<div class="loading-skeleton">' +
      '<div class="skeleton-card"><div class="skeleton-title"></div><div class="skeleton-text"></div><div class="skeleton-text short"></div><div class="skeleton-date"></div></div>' +
      '<div class="skeleton-card"><div class="skeleton-title"></div><div class="skeleton-text"></div><div class="skeleton-text short"></div><div class="skeleton-date"></div></div>' +
      '<div class="skeleton-card"><div class="skeleton-title"></div><div class="skeleton-text"></div><div class="skeleton-text short"></div><div class="skeleton-date"></div></div>' +
    '</div>';
}

async function loadArticles() {
  var container = document.getElementById('articles-list');
  showSkeleton(container);

  try {
    var res = await fetch('./data/articles.json');
    if (!res.ok) throw new Error('Failed to load articles (' + res.status + ')');
    var data = await res.json();
    var articles = data.articles || [];

    if (articles.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No articles yet.</p></div>';
      return;
    }

    container.innerHTML = articles.map(buildCard).join('');
  } catch (e) {
    container.innerHTML =
      '<div class="error-state">' +
        '<h2>Failed to load articles</h2>' +
        '<p>' + (e.message || 'An unexpected error occurred.') + '</p>' +
      '</div>';
  }
}

document.addEventListener('DOMContentLoaded', loadArticles);
