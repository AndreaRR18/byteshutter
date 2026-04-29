---
name: byteshutter-consistency
description: ByteShutter-specific design system rules: Semafor editorial aesthetic, design tokens, typography, spacing scale, dark mode, breakpoints, and what NOT to do. Invoke before adding or modifying any HTML/CSS in this project.
---

# ByteShutter Design Consistency

ByteShutter follows a **Semafor-inspired editorial newspaper aesthetic**: warm ivory paper tones, serif typography, dashed dividers, no border radius on content, controlled amber accents. Every change must stay inside this system.

## Design Tokens — Always Use These, Never Hardcode

All tokens are defined in `:root` in `css/main.css`. Reference them by name — never write raw hex or px values in component rules.

### Colors

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--bg-primary` | `#f5f0e0` warm ivory | `#111010` | Page background |
| `--bg-secondary` | `#ede8d4` | `#1a1918` | Code bg, skeleton, subtle fills |
| `--text-primary` | `#1c1a14` near-black warm | `#f0ebe0` | Headings, primary text |
| `--text-secondary` | `#4a4030` | `#b8b0a0` | Body prose, secondary content |
| `--text-muted` | `#8a7a5a` | `#7a7268` | Kicker lines, meta, timestamps |
| `--accent` | `#b08050` warm amber | `#c8a060` | Kicker colour, active states |
| `--accent-link` | `#7a5a2a` darker amber | `#c8a060` | Inline text links |
| `--border` | `#d8d0b8` | `#2e2c28` | Solid borders |
| `--border-dashed` | `#c8c0a0` | `#3a3830` | Dashed dividers, section separators |

### Border Shorthands

```css
var(--border-solid)   /* 1px solid var(--border) */
var(--border-divider) /* 1px dashed var(--border-dashed) */
```

### Typography

| Token | Value |
|-------|-------|
| `--font-heading` | `'Libre Bodoni', Georgia, serif` — all headings, logo |
| `--font-body` | `'Lora', Georgia, serif` — all body prose |
| `--font-ui` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` — nav, kickers, tags, meta |
| `--font-mono` | `'SF Mono', Monaco, 'Cascadia Code', Consolas, monospace` |

Font sizes: `--font-size-h1` (2.5rem) → `--font-size-kicker` (0.6875rem / 11px)  
Font weights: `--font-weight-h1` (700) → `--font-weight-body` (400)  
Line heights: `--line-height-h1` (1.2) → `--line-height-body` (1.7)

**Kicker line style** (nav, tags, section labels):
```css
font-family: var(--font-ui);
font-size: var(--font-size-kicker);
font-weight: 600;
text-transform: uppercase;
letter-spacing: var(--tracking-kicker); /* 0.08em */
```

### Spacing Scale (8px base)

`--space-xs` (4px) · `--space-sm` (8px) · `--space-md` (16px) · `--space-lg` (24px) · `--space-xl` (32px) · `--space-2xl` (48px) · `--space-3xl` (64px)

Use these tokens for all `margin`, `padding`, and `gap` — never raw pixel values.

### Layout

- `--max-width-content: 768px` — main content container
- `--max-width-article: 65ch` — article body line length
- `--padding-horizontal-desktop: 2rem` / `--padding-horizontal-mobile: 1rem`
- `--section-spacing: 4rem`

### Transitions

- `--transition-fast: 200ms ease` — hover states, focus
- `--transition-base: 300ms ease-out` — page-level transitions
- `--transition-theme: 200ms ease` — dark/light switch

### Border Radius

- `--radius-full: 9999px` — **theme-toggle button ONLY**
- `--radius-minimal: 2px` — **code blocks ONLY**
- **Everything else: `border-radius: 0`** — this is a hard editorial rule

## Dark Mode

Dark mode is toggled via `[data-theme="dark"]` on `<html>`. Theme is set before first paint via inline script in `<head>` — do not add any JS that writes `data-theme` after DOMContentLoaded without checking this.

Override tokens in `[data-theme="dark"] { ... }` in `css/main.css`. Never write dark-mode rules scattered across components.

The `prefers-color-scheme` is respected as the default when no stored preference exists — the inline script handles this.

## Responsive Breakpoints

```css
@media (max-width: 767px)              /* Mobile */
@media (max-width: 1023px)             /* Mobile + Tablet */
@media (max-width: 1023px) and (min-width: 768px) /* Tablet only */
```

Always follow mobile-first: base styles apply to all sizes; `max-width` queries scale back for smaller screens.

## HTML Conventions

- All pages use `<a href="#main-content" class="skip-link">` as first `<body>` element
- Navigation `<nav aria-label="Main navigation">` — always include `aria-label`
- Theme toggle: `<button class="theme-toggle" id="theme-toggle" aria-label="Switch theme">`
- Article pages: `article.html#slug` hash routing — slug is loaded as `data/<slug>.json`
- All HTML uses relative paths: `./css/`, `./js/`, `./data/`, `./images/`

## What NOT to Do

- **No border radius on content** — cards, images, containers, buttons all use `border-radius: 0`
- **No raw color values in CSS rules** — always `var(--token)`, never `#333` or `rgba(0,0,0,0.5)` inline
- **No framework classes** — this is vanilla CSS; no Tailwind, Bootstrap, or utility class conventions
- **No layout-triggering animations** — never animate `width`, `height`, `top`, `left`, `margin`; use `transform`/`opacity` only
- **No hardcoded breakpoints** that don't match the three above — use the established breakpoints
- **No inline styles** on HTML elements (except the theme-flash prevention script) — all styling goes in `css/main.css`
- **No new custom properties** outside the design token system — reuse existing tokens; if a new one is needed, add it to the `:root` block in `css/main.css`
- **No raw pixel spacing** in component rules — always use `var(--space-*)` tokens

## Article Markdown Frontmatter

```markdown
---
title: "Article Title"
excerpt: "Brief description for the articles list"
created_at: 2024-01-15
tags: ["swift", "ios"]
---
```

- `created_at` is a date (not datetime); use ISO format `YYYY-MM-DD`
- Tags are lowercase, hyphen-separated if multi-word
- Run `npm run convert` after adding/editing articles to regenerate `data/`

## Build & Deployment Checklist

Before committing any CSS/HTML change:
- [ ] All values reference design tokens, no raw hardcoded values
- [ ] `border-radius: 0` on all new content elements (only `radius-full`/`radius-minimal` exceptions)
- [ ] Dark mode still works: test `[data-theme="dark"]` overrides are correct
- [ ] Responsive: verified at 375px, 768px, 1024px
- [ ] No `!important` added
- [ ] Run `npm run compile` — zero TypeScript errors
