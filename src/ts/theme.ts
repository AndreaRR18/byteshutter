/* Theme toggle for ByteShutter */

type Theme = 'dark' | 'light';

const APERTURE_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="10" />
  <path d="M12 16.5L8.1 14.25L8.1 9.75L12 7.5L15.9 9.75L15.9 14.25Z" />
  <path d="M12 16.5L5.97 19.98M8.1 14.25L2.07 10.77M8.1 9.75V2.79M12 7.5L18.03 4.02M15.9 9.75L21.93 13.23M15.9 14.25V21.21" />
</svg>`;

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(t: Theme): void {
  document.documentElement.setAttribute('data-theme', t);
  document.documentElement.classList.toggle('dark', t === 'dark');
  document.documentElement.classList.toggle('light', t !== 'dark');
  localStorage.setItem('theme', t);

  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.innerHTML = APERTURE_SVG;
    btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

interface ViewTransitionLike {
  finished: Promise<unknown>;
}

type DocumentWithTransitions = Document & {
  startViewTransition?: (update: () => void) => ViewTransitionLike;
};

/** Switches theme with an iris reveal from the toggle where the browser supports view transitions. */
function switchTheme(next: Theme, origin: HTMLElement | null): void {
  const doc = document as DocumentWithTransitions;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof doc.startViewTransition !== 'function' || reduceMotion) {
    applyTheme(next);
    return;
  }

  const root = document.documentElement;
  if (origin) {
    const rect = origin.getBoundingClientRect();
    root.style.setProperty('--iris-x', Math.round(rect.left + rect.width / 2) + 'px');
    root.style.setProperty('--iris-y', Math.round(rect.top + rect.height / 2) + 'px');
  }

  root.classList.add('theme-vt');
  const cleanup = function (): void { root.classList.remove('theme-vt'); };
  doc.startViewTransition(function (): void { applyTheme(next); }).finished.then(cleanup, cleanup);
}

document.addEventListener('DOMContentLoaded', function () {
  applyTheme(getInitialTheme());

  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      switchTheme(current === 'dark' ? 'light' : 'dark', btn);
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
});

export {};
