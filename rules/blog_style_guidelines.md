# ByteShutter Style Guidelines ("Darkroom")

## Philosophy
- One pun, one motif: *byte* + *shutter* → the viewfinder.
- Dark-first: ink background, paper text, one safelight-orange accent.
- Personality in the chrome, calm in the prose: article pages stay a quiet reading column.
- Plain HTML, CSS and TypeScript. No framework, no bundler, no third-party requests.

## Colour (dark / light)
| Token | Dark | Light |
|---|---|---|
| `--bg-primary` | `#14110f` | `#f3ecdc` |
| `--text-primary` | `#f1e9d8` | `#17130f` |
| `--text-muted` | `#a39a88` | `#6b6253` |
| `--accent` | `#ff6b1f` | `#b03a0a` |

Run `npm run check:contrast` after any change (text/accent >= 4.5:1, UI boundaries >= 3:1).

## Typography
Bricolage Grotesque (headings, display), Lora (body), JetBrains Mono (labels, metadata, frame numbers, code). Self-hosted from `fonts/`. Fluid sizes via `--font-size-*`; body 17px desktop / 16px mobile, line-height 1.7, article measure 65ch.

## Layout
Wide container 1100px (`.wrap`); article column 65ch. Section rhythm 4rem. Square corners everywhere except the round theme toggle.

## Signature elements
Viewfinder corners (`.vf`), frame numbers (`No. 01`), mono labels (`.label`), film strip for photos, aperture theme toggle, light film grain (off on article pages).

## Motion
`motion.css` only; `prefers-reduced-motion: no-preference`; `transform`/`opacity`/`clip-path`. View transitions between pages, iris reveal on theme switch, scroll-driven reading progress and section reveals.

## Accessibility
Skip link, landmarks, visible focus (2px accent outline), alt text, 44px touch targets, reduced-motion support, no information by colour alone.

## Content
Markdown articles with frontmatter (`title`, `excerpt`, `created_at`, `tags`) converted by `npm run convert`; hash routing `article.html#slug`; GFM rendered client-side by `marked.js`.
