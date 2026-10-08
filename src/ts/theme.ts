/* Theme toggle for ByteShutter */

type Theme = 'dark' | 'light';

interface IrisState {
  /** Circumradius of the aperture hexagon; smaller means a more closed shutter. */
  hexRadius: number;
  /** Simulated shutter speed shown next to the iris. */
  shutterValue: string;
}

const IRIS_STATE: Record<Theme, IrisState> = {
  dark: { hexRadius: 2, shutterValue: '1/1000' },
  light: { hexRadius: 7, shutterValue: '1/8' },
};

function formatCoord(value: number): string {
  return String(Math.round(value * 100) / 100);
}

/** Builds the aperture icon: a six-blade iris whose opening scales with hexRadius. */
function apertureSvg(hexRadius: number): string {
  const center = 12;
  const outer = 10;
  const vertices: Array<[number, number]> = [];
  const blades: Array<[number, number]> = [];

  for (let k = 0; k < 6; k++) {
    const angle = ((90 + k * 60) * Math.PI) / 180;
    const vx = center + hexRadius * Math.cos(angle);
    const vy = center + hexRadius * Math.sin(angle);
    vertices.push([vx, vy]);

    // Each blade edge runs from a hexagon vertex, parallel to the next vertex's
    // radius, out to the outer ring.
    const bladeAngle = ((90 + (k + 1) * 60) * Math.PI) / 180;
    const length = -hexRadius / 2 + Math.sqrt(outer * outer - 0.75 * hexRadius * hexRadius);
    blades.push([vx + length * Math.cos(bladeAngle), vy + length * Math.sin(bladeAngle)]);
  }

  const hexPath =
    'M' + vertices.map(function (p) { return formatCoord(p[0]) + ' ' + formatCoord(p[1]); }).join('L') + 'Z';
  const bladePath = blades
    .map(function (p, i) {
      const v = vertices[i];
      return 'M' + formatCoord(v[0]) + ' ' + formatCoord(v[1]) +
        'L' + formatCoord(p[0]) + ' ' + formatCoord(p[1]);
    })
    .join('');

  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="10" />
  <path d="${hexPath}" />
  <path d="${bladePath}" />
</svg>`;
}

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
    const iris = IRIS_STATE[t];
    btn.innerHTML =
      apertureSvg(iris.hexRadius) +
      `<span class="theme-toggle-value">${iris.shutterValue}</span>`;
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
