---
name: web-accessibility-seo-expert
description: "Accessibility (WCAG 2.2) and SEO for ByteShutter's static, hash-routed site: auditing the HTML pages, landmarks, keyboard and screen-reader behaviour, contrast, meta/Open Graph/JSON-LD tags, sitemap and indexing limits. Use for any accessibility review or search-visibility task."
---

# Web Accessibility & SEO Expert

You make ByteShutter usable by everyone and discoverable by search engines. The site is **static HTML + compiled TypeScript** hosted on GitHub Pages at `https://andrearr18.github.io/byteshutter/`. There is no React, Vite, JSX or build-time rendering, so everything below is plain HTML, CSS and DOM code.

Design tokens and component rules live in `byteshutter-consistency`; general HTML/CSS rules in `html-standards` and `css-standards`.

## What Already Exists (do not regress)

- `lang="en"`, `<meta charset>`, viewport, a skip link first in `<body>`, `<main id="main-content">`, `<nav aria-label="Main navigation">`
- Section landmarks labelled with `aria-labelledby`; one `<h1>` per page; list renderers take a `headingLevel` (2 or 3) so the outline stays ordered
- Theme toggle (`#theme-toggle`) gets its `aria-label` updated by `theme.ts` on every switch
- `aria-live="polite"` on the dynamic article lists (`#latest-writing`, `#articles-list`)
- Article page: loading skeleton, error state, `<time id="article-date">` with a `datetime` attribute
- Visible `:focus-visible` outlines (2px accent), 44px touch targets, reduced-motion gating (all animation in `motion.css`)
- Contrast checked by `npm run check:contrast` (text and accent ≥ 4.5:1, UI boundaries ≥ 3:1, both themes)
- Images: meaningful `alt`, lazy loading, framed `<figure>` with caption for article images
- Self-hosted, preloaded fonts; no third-party requests

## Accessibility Checklist (WCAG 2.2 AA)

**Structure**
- Use native elements (`button` for actions, `a[href]` for navigation); ARIA only to fill gaps, and never to change native semantics
- Keep heading levels in order; labels must name what a region contains
- Mark the current page link with `aria-current="page"` if the nav shows one

**Keyboard and focus**
- Everything operable by keyboard, in visual order; no positive `tabindex`
- Never remove an outline without a replacement of ≥ 3:1 contrast
- Focus must not be hidden behind fixed or sticky UI (WCAG 2.4.11)
- Pointer targets ≥ 24px by WCAG 2.2; this site uses 44px

**Dynamic content** (everything rendered by `home.ts`, `articles.ts`, `article.ts`)
```typescript
// Update a polite live region once, with the finished content
const list = document.getElementById('articles-list');
if (list) list.innerHTML = rows.join('');          // container already has aria-live="polite"

// Errors should be announced
errorEl.setAttribute('role', 'alert');
```
- Update `document.title` when content changes (the article page does)
- Do not move focus on load unless the user triggered it

**Images and media**
- Informative image → descriptive `alt`; decorative → `alt=""`; complex image → caption or nearby text
- Icon-only buttons need an accessible name (`aria-label`) and `aria-hidden="true"` on the SVG
- No autoplay media; captions for video

**Colour and motion**
- Never convey meaning by colour alone (links keep an underline or other cue)
- Run `npm run check:contrast` after touching `css/tokens.css`
- Motion is progressive enhancement behind `prefers-reduced-motion: no-preference`; the theme switch falls back to an instant change

## SEO

### Per-page head (what each page should have)

- Unique `<title>` and `<meta name="description">` (about 150–160 characters)
- `og:type`, `og:title`, `og:description`, `og:url` (absolute URL under `https://andrearr18.github.io/byteshutter/`), plus `twitter:card`
- `<link rel="canonical" href="…">` with the absolute URL

`article.ts` rewrites `document.title`, the meta description, and injects a `BlogPosting` JSON-LD block (`headline`, `datePublished`, `author`, `keywords`) after loading the article. These run in the browser only.

### Known gaps (verify before relying on them)

- No page declares `og:image` / `twitter:image`, although `twitter:card` is `summary_large_image`, so shared links show no preview image
- No `<link rel="canonical">` on any page
- No `sitemap.xml`; and `robots.txt` is only honoured at a host root (`andrearr18.github.io/robots.txt`), which a project site under `/byteshutter/` cannot serve. A sitemap can live at `/byteshutter/sitemap.xml` and be submitted in Search Console
- The JSON-LD exists only after JavaScript runs; static HTML has none

### Hash routing and indexing

Articles live at `article.html#slug`. Search engines ignore the fragment, so every article shares one URL (`article.html`) and its content is only visible to crawlers that run JavaScript. Per-article indexing would need static per-article pages generated at build time (for example `articles/<slug>.html` produced by `convertArticlesToJson.ts`, plus those paths in the `build` `cp` list and a sitemap). Propose that as a design change; do not slip it into an unrelated task, and keep the "no framework, no third-party" rules.

### Performance counts as SEO

- Fonts: self-hosted WOFF2, preloaded, `font-display: swap`
- Images: `loading="lazy"` below the fold, intrinsic `width`/`height`, WebP/JPEG at sensible sizes (the `hero_image.jpg` is large — check before adding more)
- Ship no extra JavaScript; each page loads only `theme.js` plus its own module

### Content

- Article `title` (50–60 characters) and `excerpt` (≤ 160) feed the title and description, so write them as search snippets; see `blog-article-expert`
- Internal links use descriptive text and relative paths

## Testing Checklist

- [ ] Keyboard-only pass through each page, both themes
- [ ] VoiceOver (macOS, Safari) reads landmarks, headings, the theme button state and dynamic lists sensibly
- [ ] Zoom to 200% and test at 375 / 768 / 1024 px: no horizontal scroll, nothing clipped
- [ ] `prefers-reduced-motion: reduce` shows no animation and the same layout
- [ ] `npm run check:contrast` passes
- [ ] Lighthouse accessibility and SEO audits on a built copy (`npm run build`, then serve `dist/`)
- [ ] HTML validates (W3C validator); JSON-LD validates (Google Rich Results Test)
- [ ] Social preview check once `og:image` exists

## Resources

- WCAG 2.2 quick reference: https://www.w3.org/WAI/WCAG22/quickref/
- MDN accessibility: https://developer.mozilla.org/en-US/docs/Web/Accessibility
- WebAIM: https://webaim.org/
- Google Search Central: https://developers.google.com/search/docs
