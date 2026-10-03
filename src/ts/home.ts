/* Home page for ByteShutter: renders the latest articles as frame rows */

import { fetchArticleFeed, frameNumbers, renderEmptyFrameRow, renderFrameRow } from './feed.js';

const LATEST_COUNT = 3;

async function loadLatest(): Promise<void> {
  const container = document.getElementById('latest-writing');
  if (!container) return;

  try {
    const feed = await fetchArticleFeed();
    const numbers = frameNumbers(feed);
    const rows = feed.slice(0, LATEST_COUNT).map(function (article): string {
      return renderFrameRow(article, numbers.get(article.slug) ?? 0, 3);
    });
    if (feed.length < LATEST_COUNT) {
      rows.push(renderEmptyFrameRow(feed.length + 1));
    }
    container.innerHTML = rows.join('');
  } catch (e) {
    container.innerHTML =
      '<p class="state-message">Could not load the latest writing. ' +
      '<a href="./articles.html">Browse all articles</a>.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadLatest);

export {};
