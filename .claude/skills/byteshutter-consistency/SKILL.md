---
name: byteshutter-consistency
description: 'ByteShutter-specific design system rules: the "Darkroom" aesthetic (camera + code), design tokens, typography, viewfinder motif, motion, dark/light themes, breakpoints, and what NOT to do. Invoke before adding or modifying any HTML/CSS in this project.'
---

# ByteShutter Design Consistency — "Darkroom"

ByteShutter is a dark-first site built on one pun: *byte* (code) + *shutter* (camera). The page is a darkroom: ink background, paper-coloured text, one safelight-orange accent. Plain HTML, CSS and TypeScript only — no framework, no bundler.

## Files

| File | Holds |
|---|---|
| `css/tokens.css` | `@font-face`, every design token, dark (`:root`) and light (`[data-theme="light"]`) values |
| `css/main.css` | Reset/base, layout, header/footer, shared components, page sections |
| `css/motion.css` | All animation. Progressive enhancement; the site works without it |
| `src/ts/feed.ts` | Shared article-feed helpers (frame numbers, dates, row markup) |

Load order on every page: `tokens.css`, `main.css`, `motion.css`.

## Tokens — always use them, never hardcode

Colours (dark / light): `--bg-primary` `#14110f`/`#f3ecdc`, `--bg-secondary`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent` `#ff6b1f`/`#b03a0a`, `--accent-contrast`, `--border` (decorative), `--border-strong` (outlines of interactive components, >= 3:1), `--film` and `--film-hole` (film strip).
After changing any hex in `tokens.css` run `npm run check:contrast` — text and accent must stay >= 4.5:1.

Type: `--font-heading` Bricolage Grotesque, `--font-body` Lora, `--font-mono` JetBrains Mono (labels, metadata, frame numbers, code). Sizes are fluid: `--font-size-display`, `-h1` … `-h4`, `-body`, `-small`, `-label`. Self-hosted in `fonts/`; never add a Google Fonts link.

Spacing: `--space-xs` … `--space-3xl`. Layout: `--max-width-wide` (1100px), `--max-width-article` (65ch), `--header-height`.

## Signature elements (keep it to these)

1. **Viewfinder corners** — add class `vf` to a wrapper (not to an `<img>`); tune with `--vf-inset`, `--vf-size`, `--vf-weight`, `--vf-color`. Add `vf-hover` for brackets that appear on hover/focus.
2. **Frame numbers** — `No. 01`, oldest article = 1, built by `frameLabel()` in `feed.ts`.
3. **Mono labels** — class `label` (+ `label--accent`) for kickers, metadata and captions.
4. **Film strip** — `.filmstrip` / `.film-frame` for photos.
5. **Aperture toggle** — the theme button; iris reveal via view transitions.
6. **Grain** — on `body::before`, off on `body.page-article`.

**Calm rule:** article pages keep a quiet reading column (65ch, Lora). Personality lives in the header, metadata, code blocks and figures — not in the prose.

## Motion

All motion lives in `motion.css`, gated by `prefers-reduced-motion: no-preference` (and `@supports` for scroll-driven animations). Animate `transform`, `opacity`, `clip-path` only. Never make content depend on an animation having run.

## Dark / light

Dark is the default. The inline `<head>` script sets `data-theme` before first paint (stored choice, else system preference). Override tokens only inside `[data-theme="light"]` in `tokens.css`.

## Breakpoints

`@media (max-width: 767px)` mobile · `(max-width: 1023px)` mobile + tablet · `(min-width: 768px) and (max-width: 1023px)` tablet only. Verify at 375, 768, 1024 in both themes.

## HTML conventions

- Skip link first in `<body>`; `<nav aria-label="Main navigation">`; theme button `id="theme-toggle"`.
- Page container is `<div class="wrap">` (wide) or `.article-content` (article).
- Articles use hash routing: `article.html#slug` loads `data/slug.json`.
- All paths are relative (`./css/`, `./js/`, `./fonts/`, `./data/`, `./images/`).
- Every `<img>` has meaningful `alt`; give images `width`/`height` where known.

## What NOT to do

- No framework, no bundler, no new runtime dependency.
- No raw hex/px values in components — use tokens (local `--vf-*` overrides are the one exception).
- No third-party requests (fonts, analytics, scripts) — the site promises "no analytics, no tracking".
- No second accent colour; no gradients except the viewfinder/sprocket patterns; no drop shadows.
- No layout-triggering animation (`width`, `height`, `top`, `left`, `margin`).
- No `!important` (only the existing `@media print` block).
- No inline styles in markup (the theme-flash script and JS-toggled `display` on loading states are the existing exceptions).

## Article frontmatter

```markdown
---
title: "Article Title"
excerpt: "Brief description for the articles list"
created_at: 2024-01-15
tags: ["swift", "ios"]
---
```

`created_at` is `YYYY-MM-DD`; tags are lowercase. Run `npm run convert` after editing articles.

## Before committing CSS/HTML

- [ ] Tokens only, no hardcoded colours or sizes
- [ ] Both themes checked; `npm run check:contrast` passes
- [ ] 375 / 768 / 1024 px checked; no horizontal scroll
- [ ] Reduced motion: no animation, same layout
- [ ] `npm run compile` zero errors; `npm run build` succeeds
