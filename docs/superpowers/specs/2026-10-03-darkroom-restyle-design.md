# ByteShutter "Darkroom" Restyle — Design Spec

**Date:** 2026-10-03
**Branch:** `ui-improvements`
**Status:** Draft for review
**Supersedes:** the Semafor-inspired editorial restyle (PR #45) and its "locked" rules (cream palette, Libre Bodoni/Lora, zero shadows/radius, dashed dividers).

## 1. Goal

Give ByteShutter a distinct personality built around its own name — *byte* (code) + *shutter* (camera) — and make the site a place the author wants to write on again. The current site is a single flat 768px column with a newspaper look that clashes with the playful flat-vector illustrations and never uses the camera/code pun. The home page also shows no articles at all.

## 2. Decisions (from brainstorming)

| Decision | Choice |
|---|---|
| Direction | **A. Darkroom** (camera + code identity) |
| Scope | Restyle every page **and** make the home page writing-first. No new pages. |
| Signature theme | **Dark-first** "darkroom"; light mode is the "paper" variant. Toggle and system-preference behaviour unchanged. |
| Non-goals | New pages (Photos), RSS, search, tag filters, parsing real EXIF at build time, analytics, new dependencies, a bundler. |

## 3. Research summary

Reference sites reviewed (screenshots + write-ups):

- **Josh W. Comeau** — illustrated signature header, one pink kicker colour, small delights (sound toggle, interactive demos).
- **Maggie Appleton** — a huge serif sentence as the hero, a single accent colour, fluid type scale, plain HTML/CSS.
- **Lynn Fisher** — strong typographic identity (ornate red display type on grainy black, Roman-numeral nav); the site is rebuilt as a yearly toy.
- 2026 trend write-ups (Canva, Figma): hand-made, scrapbook, zine and "imperfect by design" looks are rising.

Takeaways applied here: one strong typographic voice, one loud accent, one signature motif (the viewfinder), small delights, and a calm reading page.

Platform notes: scroll-driven animations are supported across the major browsers; cross-document view transitions work in Chromium and Safari 18.2+ (Firefox: in progress), so they are progressive enhancement only.

## 4. Visual language

### 4.1 Palette

Values were eyeballed from the site's illustrations and the Milan bikes photo (the orange matches the bike baskets and the hero's orange hills). Tune against the artwork during implementation; contrast ratios below were computed from these values.

| Token | Dark (signature) | Light (paper) |
|---|---|---|
| `--bg-primary` | `#14110f` warm ink | `#f3ecdc` paper |
| `--text-primary` | `#f1e9d8` | `#17130f` |
| `--text-muted` | `#a39a88` (≈6.7:1) | `#6b6253` (≈5.1:1) |
| `--accent` | `#ff6b1f` safelight orange (≈6.6:1) | `#b03a0a` (≈5.2:1) |

Notes:
- Exactly one loud accent. The teal from the hero illustration stays inside the artwork.
- Light accent is `#b03a0a`, not the first-draft `#c2410c`, which computed to ≈4.4:1 on paper and fails WCAG AA for text.
- Surface/border tokens (`--bg-secondary`, `--border`) are derived during implementation and must keep ≥3:1 for UI boundaries.

### 4.2 Typography (all open-licence, self-hosted woff2)

| Role | Font |
|---|---|
| Display / headings | Bricolage Grotesque (variable) |
| Body | Lora 400/600 (kept; already reads well) |
| Labels, metadata, frame numbers, code | JetBrains Mono |

Self-hosting replaces the Google Fonts links so the site keeps its own "no analytics, no tracking" promise. Fonts live in `fonts/`, are declared with `font-display: swap`, and the critical files are preloaded.

### 4.3 Signature elements

1. **Viewfinder corners** — CSS-only corner brackets on the hero illustration, photos, book covers and the About portrait.
2. **Frame numbers** — each article gets `No. NN`. Numbering is by ascending `created_at` (oldest = `No. 01`), zero-padded to two digits.
3. **Film-strip frame** — sprocket-hole edges (CSS gradients) around the home photo; markup supports N frames.
4. **Aperture toggle** — the theme button becomes an aperture icon.
5. **Grain** — very light film-grain overlay on the dark background (inline SVG noise as a data URI). Disabled on article pages.

### 4.4 Calm rule

Article pages keep a quiet reading column (65ch, Lora, generous spacing). Personality lives in the header, metadata line, code blocks and image treatment, not in the prose.

## 5. Pages

Containers: home, lists and About use a wider `--max-width-wide` (1100px); the article text column stays 65ch. Breakpoints are unchanged (≤767, ≤1023, 768–1023).

### 5.1 Home (writing first)

1. **Hero** — Bricolage headline with the existing copy ("Hey there, web surfer! Welcome to this little corner of the internet."). Illustration inside a viewfinder frame; "No analytics, no tracking…" as a mono caption. Two columns on desktop, stacked on mobile.
2. **Latest writing** — up to the 3 newest articles as frame-numbered rows, loaded from `data/articles.json` by a new `home.ts`. If fewer than 3 exist, show **one** placeholder row, "Next frame is in the developing tray", rather than padding every slot.
3. **Photo** — `orange_pattern.jpg` in a film-strip frame, captioned `NIKON D3100 · 2024-02-13` (hand-written; matches the file's EXIF). One frame today; adding frames later means adding an `<img>`.
4. **Books** — "Currently reading" large with viewfinder corners; "Recently read" as a compact row of covers. Existing copy unchanged.
5. **Links** — "Interesting Articles" as a mono list.
6. **About teaser** — moved to the bottom.

### 5.2 Articles list

Rows with a large mono frame number on the left, title in the display font, excerpt, and a mono line `TAG · 06 MAY 2020`. On hover/focus, viewfinder brackets appear around the row and the title turns accent-coloured. Read time stays on the article page only (no change to the converter).

### 5.3 Article page

Frame number, tag kicker, big display title, mono meta line (date · read time). Body in Lora at 65ch. Code blocks become a panel with the language in mono and an accent left rule (language read from marked's `language-*` class). Images get viewfinder corners and a mono caption.

### 5.4 About

Portrait in a viewfinder frame. "What I Do" becomes a camera-style spec sheet of key/value rows. Copy is unchanged.

### 5.5 Nav and footer

Sticky nav: wordmark, Articles, About, aperture toggle. Footer: a quiet mono line.

## 6. Motion

All motion is progressive enhancement, wrapped in `prefers-reduced-motion: no-preference` (and `@supports` where relevant), and animates only `transform`/`opacity`/`clip-path`.

- **Page transitions** — `@view-transition { navigation: auto }`; the header keeps a `view-transition-name` so it stays put while content crossfades. Browsers without support navigate normally.
- **Scroll-driven** — an accent reading-progress line on article pages (`animation-timeline: scroll()`); gentle fade-ins for home sections (`animation-timeline: view()`).
- **Aperture toggle** — theme switch via `document.startViewTransition` with a circular `clip-path` reveal from the button; instant swap where unsupported.
- **Viewfinder hover** — corner brackets snap in on hover and `:focus-visible`.

## 7. Implementation structure

- **CSS (3 files):** `css/tokens.css` (palette, type, spacing, dark/light overrides), `css/main.css` (base, layout, components, pages), `css/motion.css` (all animation, removable as one unit). Each HTML page links all three.
- **Fonts:** `fonts/*.woff2`; add `fonts` to the `cp` list in `npm run build` so it ships in `dist/`.
- **TypeScript (strict, no new dependencies):** new `src/ts/home.ts`; updates to `theme.ts` (iris toggle), `articles.ts` (frame numbers, new row markup) and `article.ts` (frame number, code-block labels). `tsconfig.browser.json` already includes `src/ts/**/*.ts`, so no config change is needed.
- **`.gitignore`:** add `js/home.js` next to the other compiled outputs.
- **HTML:** `index.html`, `articles.html`, `article.html`, `about.html` updated (new fonts/CSS links, markup for new components, preload hints). Existing a11y structure (skip link, `aria-label`s, landmarks) is preserved.

## 8. Rollout (one commit per step, on `ui-improvements`)

1. Fonts (self-hosted), `tokens.css`, build-script change.
2. Base, layout, nav, footer, aperture toggle.
3. Home page + `home.ts`.
4. Articles list + article page (incl. code blocks, images).
5. About page.
6. Motion layer (`motion.css`, theme view transition).
7. Docs and agent config rewritten for the new system: `.claude/skills/byteshutter-consistency`, `CLAUDE.md` + `AGENTS.md` (kept identical via `sync-ai-config`), `rules/blog_style_guidelines.md` (already stale: blue accent, system font), README if it mentions the old look, and the project memory note.

## 9. Verification (per step)

- `npm run compile` — zero TypeScript errors; `npm run build` succeeds and `dist/` contains `fonts/`.
- Visual check of every page at 375, 768 and 1024px in both themes.
- Text and accent contrast ≥ 4.5:1 (UI boundaries ≥ 3:1).
- Keyboard focus visible on all interactive elements; skip link still works.
- Reduced motion: no animations run; layout identical.
- Fallbacks: with view transitions and scroll-driven animations unsupported, pages are fully usable (Firefox cross-document behaviour cannot be tested locally and relies on the fallback).
- Markup validity: headings in order, images have `alt`, nothing depends on the new fonts having loaded (system serif/sans/mono fallbacks in each stack).

## 10. Risks and open items

- **Palette is eyeballed.** Final hex values are tuned against the artwork in step 1 and re-checked for contrast.
- **One photo, one article today.** The home page is designed to look intentional with sparse content (single film frame, one placeholder row); it improves automatically as content is added.
- **Font files must be downloaded** (Bricolage Grotesque, Lora, JetBrains Mono — all SIL OFL). This is done in step 1 from the fonts' official sources; licence files are kept alongside the woff2s.
- **Kitsch risk.** The camera motif is limited to five named elements and kept off article prose; additions beyond them need a reason.
- **Old rules are being retired.** Until step 7 lands, the `byteshutter-consistency` skill still describes the Semafor system and will contradict the new CSS.
