---
name: css-standards
description: "Apply authoritative CSS best practices: specificity, naming, responsive layout (Grid/Flexbox), custom properties, dark mode, accessibility, and performance. Invoke before writing or reviewing any CSS."
---

# CSS Standards

Reference this skill before writing or reviewing any CSS. Apply every applicable rule.

General rules only: where `byteshutter-consistency` is more specific (tokens, breakpoints, theming, motion), that skill wins. Load both for any ByteShutter CSS.

## Specificity & Architecture

- Keep specificity as low as possible — use class selectors as the default
- Never use `!important` as a specificity fix; if needed, it signals an architecture problem
- Avoid selector chaining: `.nav-link` not `.header nav ul li a`
- Prefer `:where()` when resetting inherited defaults at zero specificity:
  ```css
  :where(h1, h2, h3) { line-height: 1.2; }
  ```
- Use CSS custom properties (`--token-name`) for all design tokens — never hardcode raw values in component rules

## Naming

- Use lowercase hyphenated class names: `.article-card`, `.post-title`
- BEM for component internals when helpful: `.block__element--modifier`
- Be descriptive at the component level, not the visual level: `.article-card` not `.white-box`

## Layout

- **Flexbox** for single-axis layout (nav bars, centering, row/column distribution)
- **CSS Grid** for two-dimensional layout (page structure, card grids, complex alignment)
- Combine them: Grid for page-level structure, Flexbox for component internals
- Self-responsive grids without media queries:
  ```css
  .grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
  ```
- Use `gap` instead of margins for spacing between flex/grid children

## Units & Values

- Use `rem` for font sizes and most sizing (scales with root font)
- Use `em` for component-relative spacing (padding, line-height)
- Use `%` or `ch` for widths that should flow with content
- Use `px` only for borders, outlines, and fine-tuned fixed values
- Omit units on `0`: `margin: 0` not `margin: 0px`
- Use 3-digit hex when possible: `#333` not `#333333`
- Use `0.5rem` shorthand style in spacing tokens, not `8px` raw values

## Responsive Design

- Write fluid base styles (clamp, `auto-fit` grids, `max-width` containers) so few overrides are needed
- ByteShutter breakpoints: `(max-width: 767px)` mobile, `(max-width: 1023px)` mobile + tablet, `(min-width: 768px) and (max-width: 1023px)` tablet only; verify at 375, 768 and 1024px
- Never use fixed pixel widths on containers — use `max-width` + `width: 100%`
- Ensure content reflows at 200% zoom without horizontal scroll
- Line height ≥ 1.5 for body text; paragraph spacing ≥ 2× font size

## Custom Properties (Design Tokens)

- Define all tokens in `:root`
- Use semantic names: `--text-primary`, `--bg-primary`, `--accent` — not `--dark-grey`
- Dark mode overrides go in `[data-theme="dark"]` or `@media (prefers-color-scheme: dark)`
- Shorthand derived tokens: `--border-solid: 1px solid var(--border)`
- Never define a color inline in a rule; always reference a token

## Dark Mode & Theming

- Define all colors as tokens in `:root`; ByteShutter is dark-first, so `:root` holds the dark values and `[data-theme="light"]` overrides them (see `css/tokens.css`)
- Set `color-scheme` to match the active theme so native UI (scrollbars, form controls) follows it
- Use off-white on off-black (`#f1e9d8` on `#14110f`) — not pure `#fff` on `#000`
- Verify 4.5:1 contrast ratio in **both** light and dark themes — `npm run check:contrast` does this for `css/tokens.css`
- Apply `filter: brightness(0.85)` on images in dark mode to avoid harsh contrast

## Accessibility

- **Never** use `outline: none` on `:focus` without providing a visible replacement
- Focus indicator must have ≥ 3:1 contrast with surrounding background: use `outline: 2px solid var(--accent)`
- Respect reduced motion. ByteShutter puts all animation in `css/motion.css` behind `@media (prefers-reduced-motion: no-preference)`, so there is nothing to undo. Elsewhere, the usual fallback is:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
  (`!important` is acceptable in this reset only; the project avoids it everywhere else.)
- Text links must be visually distinct from body text (underline + color, not color alone)
- Interactive tap targets: minimum 44×44px on mobile

## Performance

- **Only animate** `transform`, `opacity`, `filter` and `clip-path` — never `width`, `height`, `margin`, `top`, `left` (they trigger layout/repaint)
- Use `will-change: transform` sparingly and only on actively animated elements
- Apply `content-visibility: auto` + `contain-intrinsic-size` on long-scroll page sections to skip off-screen rendering
- Use `font-display: swap` in all `@font-face` rules
- Keep selectors simple and short — long chains are slower to match and brittle to HTML changes
- Remove unused CSS before shipping

## Font Loading

- Use `@font-face` with `font-display: swap`
- Self-host WOFF2 from `fonts/` (declared in `css/tokens.css`) — never load fonts from a third-party host
- Subset with `unicode-range` if serving only Latin characters
- Preload critical fonts in `<head>` using `<link rel="preload">`

## Code Style

- One blank line between unrelated rule blocks
- Space after `:` in declarations: `color: red` not `color:red`
- Use shorthand properties: `margin: 0 1rem 2rem` not four separate declarations
- Double quotes in attribute selectors: `[data-theme="dark"]`
- Group properties logically: layout → box model → typography → visual → transitions
