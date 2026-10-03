# ByteShutter "Darkroom" Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle ByteShutter as a dark-first "Darkroom" site (camera + code identity) with a writing-first home page, using plain HTML, CSS and TypeScript only.

**Architecture:** Three stylesheets (`tokens.css`, `main.css`, `motion.css`) replace the single 1500-line `main.css`. Pages are converted one at a time; the old page CSS lives in a temporary `css/legacy.css` that only unconverted pages link, and is deleted when the last page is converted. A small shared module `src/ts/feed.ts` holds the article-feed helpers (frame numbers, date format, row markup) used by the home, list and detail scripts.

**Tech Stack:** HTML, CSS (custom properties, `color-mix`, scroll-driven animations, view transitions), TypeScript 6 strict compiled with `tsc`, `tsx` for one small Node check script. **No framework, no bundler, no new runtime dependencies.**

**Spec:** `docs/superpowers/specs/2026-10-03-darkroom-restyle-design.md`

## Global Constraints

- Plain HTML, CSS and TypeScript only: no framework, no bundler, no new runtime dependencies (user instruction, reaffirmed 2026-10-03).
- TypeScript stays strict (`tsconfig.browser.json`: `strict`, `noUnusedLocals`, `noUnusedParameters`); `npm run compile` must report zero errors after every task.
- Palette (dark / light): `--bg-primary` `#14110f` / `#f3ecdc`; `--text-primary` `#f1e9d8` / `#17130f`; `--text-muted` `#a39a88` / `#6b6253`; `--accent` `#ff6b1f` / `#b03a0a`. Exactly one loud accent.
- Fonts: Bricolage Grotesque (display), Lora 400/600 (body), JetBrains Mono (labels, metadata, code); self-hosted woff2 in `fonts/`, `font-display: swap`; no Google Fonts links anywhere.
- Contrast: text and accent >= 4.5:1; essential UI boundaries >= 3:1 (verified by `npm run check:contrast`).
- Breakpoints unchanged: `max-width: 767px`, `max-width: 1023px`, `768px–1023px`. Verify every page at 375, 768 and 1024 px in both themes.
- Motion is progressive enhancement: gated by `prefers-reduced-motion: no-preference` (and `@supports` where relevant), animating only `transform`, `opacity`, `clip-path`.
- Frame numbers: ascending `created_at`, oldest = `No. 01`, zero-padded to two digits.
- Keep the a11y structure: skip link first in `<body>`, `<nav aria-label="Main navigation">`, theme button `id="theme-toggle"`, landmarks, meaningful `alt` text.
- Existing copy is preserved. Permitted copy edits: footer line, the emoji removed from the three contact links, the leading " - " removed from "Interesting Articles" notes, "a whole section on my background" becomes a link, hero/photo `alt` text rewritten.
- The old "zero radius / zero shadow / dashed divider / Semafor" rules are retired. Corners stay square; only the theme toggle and the logo's centre dot are round.
- Work on branch `ui-improvements`. One commit per task, local only (no push, no PR). Commit messages end with: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`
- Dev server for visual checks: `python3 -m http.server 3000` from the repo root (stop it at the end with `pkill -f "http.server 3000"`).
- `CLAUDE.MD` is the tracked filename (uppercase `.MD`); use that exact spelling in `git add`.

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `fonts/*.woff2`, `fonts/LICENSE-*.txt` | Create | Self-hosted fonts + licences |
| `css/tokens.css` | Create | `@font-face`, palette, type scale, spacing, layout, motion easing, viewfinder tokens, dark/light overrides, temporary legacy aliases |
| `css/main.css` | Rewrite | Reset/base, layout, grain, header, footer, shared components (label, tag, viewfinder, states, skeleton), home, articles, article, about |
| `css/motion.css` | Create | All animation: view transitions, scroll-driven, viewfinder snap, aperture toggle, iris reveal |
| `css/legacy.css` | Create (temp), delete in Task 5 | Old page sections for pages not yet converted |
| `scripts/CheckContrast/checkContrast.ts` | Create | Contrast check for the token pairs |
| `src/ts/feed.ts` | Create | Shared feed helpers: `fetchArticleFeed`, `frameNumbers`, `frameLabel`, `formatShortDate`, `escapeHtml`, `renderFrameRow`, `renderEmptyFrameRow` |
| `src/ts/home.ts` | Create | Renders "Latest writing" on the home page |
| `src/ts/articles.ts`, `src/ts/article.ts`, `src/ts/theme.ts` | Modify | Frame-number rows; article kicker/code labels/figures; aperture toggle + iris |
| `index.html`, `articles.html`, `article.html`, `about.html` | Modify | New head links, markup, scripts |
| `package.json` | Modify | `fonts` in build copy list; `check:contrast` script |
| `.gitignore` | Modify | `js/home.js`, `js/feed.js` |
| `.claude/skills/byteshutter-consistency/SKILL.md`, `CLAUDE.MD`, `AGENTS.md`, `rules/blog_style_guidelines.md`, `README.md`, spec, memory | Modify | Retire the Semafor rules; document Darkroom |

**Not in scope:** new pages, RSS, search, tag filters, parsing real EXIF, analytics, optimising the 5.2 MB `images/highlighted/hero_image.jpg` (it is a PNG with a `.jpg` extension; flagged to the user in the final report).

---

### Task 0: Preflight and commit spec + plan

**Files:**
- Add to git: `docs/superpowers/specs/2026-10-03-darkroom-restyle-design.md`, `docs/superpowers/plans/2026-10-03-darkroom-restyle.md`

**Interfaces:**
- Produces: a green baseline (`compile` + `build`) to compare against.

- [ ] **Step 1: Confirm branch and baseline**

Run: `git branch --show-current && git status --short && npx tsc -p tsconfig.browser.json --noEmit && echo TSC_OK`
Expected: `ui-improvements`, only `?? docs/` listed, then `TSC_OK`.

- [ ] **Step 2: Baseline build**

Run: `npm run build 2>&1 | tail -5 && ls dist`
Expected: no errors; `dist` lists `index.html articles.html article.html about.html css js images data favicon.svg`.

- [ ] **Step 3: Commit the spec and plan**

```bash
git add docs/superpowers/specs/2026-10-03-darkroom-restyle-design.md docs/superpowers/plans/2026-10-03-darkroom-restyle.md
git commit -m "docs: add Darkroom restyle spec and implementation plan

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 1: Foundation — fonts, tokens, contrast check, build

**Files:**
- Create: `scripts/CheckContrast/checkContrast.ts`, `css/tokens.css`, `fonts/*`
- Modify: `package.json`, `.gitignore`

**Interfaces:**
- Produces (CSS custom properties used by all later tasks): `--bg-primary --bg-secondary --text-primary --text-secondary --text-muted --accent --accent-contrast --border --border-strong --film --header-bg --grain-opacity`; fonts `--font-heading --font-body --font-mono`; sizes `--font-size-display --font-size-h1 --font-size-h2 --font-size-h3 --font-size-h4 --font-size-body --font-size-small --font-size-label`; `--font-weight-heading`; `--line-height-display --line-height-h1 --line-height-h2 --line-height-h3 --line-height-body --line-height-small`; `--tracking-label`; spacing `--space-xs … --space-3xl`; layout `--max-width-wide --max-width-article --max-width-content --padding-horizontal-desktop --padding-horizontal-mobile --section-spacing --header-height`; viewfinder `--vf-size --vf-weight --vf-inset --vf-color`; `--transition-fast --transition-theme --ease-snap`; `--radius-full`.
- Produces: `npm run check:contrast`.

- [ ] **Step 1: Write the failing contrast check**

Create `scripts/CheckContrast/checkContrast.ts`:

```ts
/* Verifies WCAG contrast for the colour tokens in css/tokens.css.
 * Run with: npm run check:contrast
 * The dark theme is the :root block; the light theme is [data-theme="light"]
 * and is merged over the dark one.
 */
import * as fs from "fs";
import * as path from "path";

type Tokens = Record<string, string>;

interface Pair {
  fg: string;
  bg: string;
  min: number;
  label: string;
}

const css = fs.readFileSync(path.join(process.cwd(), "css", "tokens.css"), "utf8");

function readBlock(selector: string): Tokens {
  const start = css.indexOf(selector + " {");
  if (start === -1) {
    throw new Error("Block not found in css/tokens.css: " + selector);
  }
  const end = css.indexOf("}", start);
  const tokens: Tokens = {};
  for (const match of css.slice(start, end).matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}

function channel(value: number): number {
  const s = value / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort(function (x, y) { return y - x; });
  return (hi + 0.05) / (lo + 0.05);
}

const PAIRS: Pair[] = [
  { fg: "--text-primary", bg: "--bg-primary", min: 4.5, label: "body text on page" },
  { fg: "--text-primary", bg: "--bg-secondary", min: 4.5, label: "body text on surface" },
  { fg: "--text-secondary", bg: "--bg-primary", min: 4.5, label: "secondary text on page" },
  { fg: "--text-secondary", bg: "--bg-secondary", min: 4.5, label: "secondary text on surface" },
  { fg: "--text-muted", bg: "--bg-primary", min: 4.5, label: "muted text on page" },
  { fg: "--text-muted", bg: "--bg-secondary", min: 4.5, label: "muted text on surface" },
  { fg: "--accent", bg: "--bg-primary", min: 4.5, label: "accent text on page" },
  { fg: "--accent", bg: "--bg-secondary", min: 4.5, label: "accent text on surface" },
  { fg: "--accent-contrast", bg: "--accent", min: 4.5, label: "text on accent fill" },
  { fg: "--border-strong", bg: "--bg-primary", min: 3, label: "UI boundary on page" }
];

const dark = readBlock(":root");
const themes: Record<string, Tokens> = {
  dark: dark,
  light: Object.assign({}, dark, readBlock('[data-theme="light"]'))
};

let failures = 0;
for (const name of Object.keys(themes)) {
  console.log("\n" + name.toUpperCase());
  for (const pair of PAIRS) {
    const fg = themes[name][pair.fg];
    const bg = themes[name][pair.bg];
    if (!fg || !bg) {
      throw new Error("Missing token for " + pair.label + " in " + name + " theme");
    }
    const value = ratio(fg, bg);
    const ok = value >= pair.min;
    if (!ok) failures += 1;
    console.log(
      (ok ? "  ok   " : "  FAIL ") + value.toFixed(2).padStart(5) + ":1 (min " + pair.min + ")  " + pair.label
    );
  }
}

if (failures > 0) {
  console.error("\n" + failures + " contrast check(s) failed");
  process.exit(1);
}
console.log("\nAll contrast checks passed");
```

Add the npm script. In `package.json` `scripts`, add after `"convert"`:

```json
    "check:contrast": "npx tsx scripts/CheckContrast/checkContrast.ts",
```

- [ ] **Step 2: Run it and verify it fails**

Run: `npm run check:contrast 2>&1 | tail -5`
Expected: FAIL with `ENOENT … css/tokens.css` (the file does not exist yet).

- [ ] **Step 3: Copy the fonts and their licences**

```bash
SRC=/private/tmp/claude-501/-Users-andrea-Documents-Sites-byteshutter/941f52b8-f41f-4e6d-88b9-4ad74cc4e2af/scratchpad/fonts-src/node_modules
mkdir -p fonts
cp "$SRC/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2" fonts/
cp "$SRC/@fontsource/lora/files/lora-latin-400-normal.woff2" "$SRC/@fontsource/lora/files/lora-latin-600-normal.woff2" "$SRC/@fontsource/lora/files/lora-latin-400-italic.woff2" fonts/
cp "$SRC/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2" "$SRC/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-600-normal.woff2" fonts/
cp "$SRC/@fontsource-variable/bricolage-grotesque/LICENSE" fonts/LICENSE-bricolage-grotesque.txt
cp "$SRC/@fontsource/lora/LICENSE" fonts/LICENSE-lora.txt
cp "$SRC/@fontsource/jetbrains-mono/LICENSE" fonts/LICENSE-jetbrains-mono.txt
ls -la fonts && head -3 fonts/LICENSE-lora.txt
```
Expected: 6 `.woff2` files (about 20–45 KB each) and 3 licence files; the licences mention the SIL Open Font License.

- [ ] **Step 4: Write `css/tokens.css`**

```css
/* =============================================================
   ByteShutter — Design Tokens ("Darkroom")
   Dark is the signature theme and the default; [data-theme="light"]
   is the paper variant. Colour contrast is checked by:
       npm run check:contrast
   (that script reads only the hex values in the two theme blocks).
   ============================================================= */

/* -------------------------------------------------------------
   Fonts — self-hosted, SIL Open Font License (see fonts/LICENSE-*.txt)
   ------------------------------------------------------------- */
@font-face {
    font-family: 'Bricolage Grotesque';
    src: url('../fonts/bricolage-grotesque-latin-wght-normal.woff2') format('woff2');
    font-weight: 200 800;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'Lora';
    src: url('../fonts/lora-latin-400-normal.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'Lora';
    src: url('../fonts/lora-latin-600-normal.woff2') format('woff2');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'Lora';
    src: url('../fonts/lora-latin-400-italic.woff2') format('woff2');
    font-weight: 400;
    font-style: italic;
    font-display: swap;
}

@font-face {
    font-family: 'JetBrains Mono';
    src: url('../fonts/jetbrains-mono-latin-400-normal.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'JetBrains Mono';
    src: url('../fonts/jetbrains-mono-latin-600-normal.woff2') format('woff2');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
}

/* -------------------------------------------------------------
   Dark theme (signature, default)
   ------------------------------------------------------------- */
:root {
    color-scheme: dark;

    /* --- COLOUR --- */
    --bg-primary:      #14110f;   /* warm ink */
    --bg-secondary:    #1d1915;   /* surfaces: code, skeletons */
    --text-primary:    #f1e9d8;   /* paper */
    --text-secondary:  #cdc4b1;
    --text-muted:      #a39a88;   /* labels, metadata */
    --accent:          #ff6b1f;   /* safelight orange — the only loud colour */
    --accent-contrast: #14110f;   /* text on accent fills */
    --border:          #2e2822;   /* decorative dividers */
    --border-strong:   #6b6355;   /* outlines of interactive components */
    --film:            #0b0908;   /* film-strip base (dark in both themes) */
    --header-bg:       color-mix(in srgb, var(--bg-primary) 88%, transparent);
    --grain-opacity:   0.07;

    /* --- TYPOGRAPHY --- */
    --font-heading: 'Bricolage Grotesque', 'Helvetica Neue', Arial, sans-serif;
    --font-body:    'Lora', Georgia, 'Times New Roman', serif;
    --font-mono:    'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace;

    --font-size-display: clamp(2.75rem, 1.5rem + 5.5vw, 5rem);
    --font-size-h1:      clamp(2.25rem, 1.5rem + 3.2vw, 3.75rem);
    --font-size-h2:      clamp(1.625rem, 1.25rem + 1.6vw, 2.5rem);
    --font-size-h3:      clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);
    --font-size-h4:      1.125rem;
    --font-size-body:    1.0625rem;
    --font-size-small:   0.875rem;
    --font-size-label:   0.75rem;

    --font-weight-heading: 700;

    --line-height-display: 1.02;
    --line-height-h1:      1.08;
    --line-height-h2:      1.15;
    --line-height-h3:      1.25;
    --line-height-body:    1.7;
    --line-height-small:   1.5;

    --tracking-label: 0.06em;

    /* --- SPACING (8px scale) --- */
    --space-xs:  0.25rem;
    --space-sm:  0.5rem;
    --space-md:  1rem;
    --space-lg:  1.5rem;
    --space-xl:  2rem;
    --space-2xl: 3rem;
    --space-3xl: 4rem;

    /* --- LAYOUT --- */
    --max-width-wide:             1100px;
    --max-width-article:          65ch;
    --max-width-content:          768px;
    --padding-horizontal-desktop: 2rem;
    --padding-horizontal-mobile:  1rem;
    --section-spacing:            4rem;
    --header-height:              64px;

    /* --- VIEWFINDER (corner brackets) --- */
    --vf-size:   1.25rem;
    --vf-weight: 2px;
    --vf-inset:  0.75rem;
    --vf-color:  var(--accent);

    /* --- MOTION --- */
    --transition-fast:  160ms ease;
    --transition-theme: 200ms ease;
    --ease-snap:        cubic-bezier(0.2, 0.8, 0.2, 1);

    /* --- SHAPE --- */
    --radius-full: 9999px;
}

@media (max-width: 767px) {
    :root {
        --font-size-body: 1rem;
        --header-height:  56px;
    }
}

/* -------------------------------------------------------------
   Light theme ("paper")
   ------------------------------------------------------------- */
[data-theme="light"] {
    color-scheme: light;

    --bg-primary:      #f3ecdc;
    --bg-secondary:    #ebe3cf;
    --text-primary:    #17130f;
    --text-secondary:  #3d362b;
    --text-muted:      #6b6253;
    --accent:          #b03a0a;
    --accent-contrast: #f3ecdc;
    --border:          #d6cdb6;
    --border-strong:   #8f8573;
    --grain-opacity:   0.05;
}

/* -------------------------------------------------------------
   LEGACY ALIASES — only for css/legacy.css; removed in Task 5
   ------------------------------------------------------------- */
:root {
    --accent-link:      var(--accent);
    --border-dashed:    var(--border);
    --border-solid:     1px solid var(--border);
    --border-divider:   1px solid var(--border);
    --font-ui:          var(--font-mono);
    --font-size-kicker: var(--font-size-label);
    --tracking-kicker:  var(--tracking-label);
    --transition-base:  300ms ease-out;
    --radius-minimal:   0;
}
```

- [ ] **Step 5: Run the check and verify it passes**

Run: `npm run check:contrast`
Expected: a DARK and a LIGHT table, every line `ok`, ending `All contrast checks passed`. If a pair prints `FAIL`, nudge that token's lightness in `css/tokens.css` and re-run until it passes (the light `--border-strong` and `--accent` are the tightest).

- [ ] **Step 6: Ship fonts in the build and ignore new compiled files**

In `package.json`, change the `build` script's copy list from `… css js images data dist/` to `… css js fonts images data dist/`, so the line reads:

```json
    "build": "npm run compile && npm run convert && mkdir -p dist && cp -r index.html articles.html article.html about.html favicon.svg .nojekyll css js fonts images data dist/"
```

In `.gitignore`, add under `js/article.js`:

```
js/home.js
js/feed.js
```

- [ ] **Step 7: Verify the build**

Run: `npm run build 2>&1 | tail -3 && ls dist/fonts | wc -l && ls dist/css`
Expected: no errors; `9` entries in `dist/fonts` (6 woff2 + 3 licences); `dist/css` shows `main.css tokens.css`.

- [ ] **Step 8: Commit**

```bash
git add scripts/CheckContrast css/tokens.css fonts package.json .gitignore
git commit -m "style: add Darkroom design tokens, self-hosted fonts and contrast check

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Base, layout, nav, footer and aperture toggle

**Files:**
- Create: `css/legacy.css`
- Rewrite: `css/main.css`
- Modify: `index.html`, `articles.html`, `article.html`, `about.html` (head, `<body>` class, logo, footer), `src/ts/theme.ts`

**Interfaces:**
- Consumes: all tokens from Task 1.
- Produces (classes for later tasks): `.wrap` (wide container, `padding-inline`), `.label`, `.label--accent`, `.tag`, `.vf` (+ `.vf-hover`; brackets drawn on `::after`, tuned with `--vf-inset`/`--vf-size`), `.state-message`, `.error-state`, `.empty-state`, skeleton classes (`.loading-skeleton .skeleton-card .skeleton-title .skeleton-text .skeleton-text.short .skeleton-date`), `.read-progress` (hidden by default), `.logo-mark`, `.theme-toggle`. `main.css` ends with the marker `/* @@next-section */` where later tasks append.
- Produces (HTML): every page links `tokens.css` → `main.css` → `legacy.css`, has `<body class="legacy-layout">` (article also `page-article`), and the footer contains two `.footer-text` paragraphs.

- [ ] **Step 1: Move the old page sections into `css/legacy.css`**

Run (the old sections 7–11 start at line 641 of the current `css/main.css`; confirm first):

```bash
sed -n '641,642p' css/main.css
```
Expected: `/* -----…` then `   7. Landing Page (from Landing.module.css + all section modules)`.

```bash
python3 - <<'EOF'
import pathlib
lines = pathlib.Path('css/main.css').read_text().splitlines(keepends=True)
tail = ''.join(lines[640:])
prefix = '''/* =============================================================
   TEMPORARY — pre-restyle page sections.
   Only pages that have not been converted link this file.
   Deleted in Task 5 together with the legacy aliases in tokens.css.
   ============================================================= */

body.legacy-layout main {
    max-width: var(--max-width-content);
    margin: 0 auto;
    padding-left: var(--padding-horizontal-desktop);
    padding-right: var(--padding-horizontal-desktop);
    padding-top: calc(var(--header-height) + var(--space-lg));
}

@media (max-width: 1023px) {
    body.legacy-layout main {
        padding-left: var(--padding-horizontal-mobile);
        padding-right: var(--padding-horizontal-mobile);
    }
}

'''
pathlib.Path('css/legacy.css').write_text(prefix + tail)
print('legacy.css lines:', len((prefix + tail).splitlines()))
EOF
grep -o 'var(--[a-z0-9-]*)' css/legacy.css | sort -u | sed 's/var(\(.*\))/\1/' > /tmp/legacy-vars.txt; for v in $(cat /tmp/legacy-vars.txt); do grep -q -- "$v:" css/tokens.css || echo "UNDEFINED: $v"; done; echo CHECKED
```
Expected: `legacy.css lines: ~900`, then only `CHECKED` (no `UNDEFINED:` lines). If a token is reported undefined, add it to the legacy-alias block in `css/tokens.css` with an equivalent value.

- [ ] **Step 2: Rewrite `css/main.css`**

Replace the whole file with:

```css
/* =============================================================
   ByteShutter — Main Stylesheet ("Darkroom")
   Base, layout, header/footer, shared components and pages.
   Tokens: tokens.css · Animation: motion.css
   ============================================================= */

/* -------------------------------------------------------------
   1. Reset & base
   ------------------------------------------------------------- */
*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    -webkit-text-size-adjust: 100%;
}

body {
    font-family: var(--font-body);
    font-size: var(--font-size-body);
    line-height: var(--line-height-body);
    color: var(--text-primary);
    background-color: var(--bg-primary);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: clip;
    transition:
        color var(--transition-theme),
        background-color var(--transition-theme);
}

h1,
h2,
h3,
h4 {
    font-family: var(--font-heading);
    font-weight: var(--font-weight-heading);
    color: var(--text-primary);
    letter-spacing: -0.02em;
    text-wrap: balance;
}

h1 {
    font-size: var(--font-size-h1);
    line-height: var(--line-height-h1);
    margin-bottom: var(--space-lg);
}

h2 {
    font-size: var(--font-size-h2);
    line-height: var(--line-height-h2);
    margin-bottom: var(--space-md);
}

h3 {
    font-size: var(--font-size-h3);
    line-height: var(--line-height-h3);
    margin-bottom: var(--space-md);
}

h4 {
    font-size: var(--font-size-h4);
    line-height: var(--line-height-h3);
    margin-bottom: var(--space-sm);
}

p {
    margin-bottom: var(--space-md);
    max-width: var(--max-width-article);
    text-wrap: pretty;
}

a {
    color: var(--accent);
    text-decoration: none;
    transition: color var(--transition-fast);
}

a:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
}

code {
    font-family: var(--font-mono);
    font-size: 0.875em;
    background-color: var(--bg-secondary);
    border: 1px solid var(--border);
    padding: 0.1em 0.35em;
}

pre {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: 1.6;
    background-color: var(--bg-secondary);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    padding: var(--space-lg);
    margin: var(--space-lg) 0;
    max-width: 100%;
    overflow-x: auto;
    tab-size: 2;
}

pre[data-lang]::before {
    content: attr(data-lang);
    display: block;
    margin-bottom: var(--space-md);
    font-size: var(--font-size-label);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    color: var(--text-muted);
}

pre code {
    font-size: inherit;
    background: none;
    border: 0;
    padding: 0;
}

ul,
ol {
    padding-left: var(--space-lg);
    margin-bottom: var(--space-md);
}

li {
    margin-bottom: var(--space-xs);
}

img,
picture,
video,
canvas,
svg {
    display: block;
    max-width: 100%;
    height: auto;
}

button {
    font: inherit;
    color: inherit;
    cursor: pointer;
    border: 0;
    background: none;
}

input,
textarea,
select {
    font: inherit;
}

hr {
    border: 0;
    border-top: 1px solid var(--border);
    margin: var(--space-xl) 0;
}

table {
    border-collapse: collapse;
    width: 100%;
}

blockquote {
    border-left: 3px solid var(--accent);
    padding-left: var(--space-lg);
    margin: var(--space-xl) 0;
    font-style: italic;
    color: var(--text-secondary);
}

:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
}

::selection {
    background-color: var(--accent);
    color: var(--accent-contrast);
}

@supports (scrollbar-width: thin) {
    * {
        scrollbar-width: thin;
        scrollbar-color: var(--border-strong) transparent;
    }
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.skip-link {
    position: absolute;
    top: -4rem;
    left: var(--space-md);
    z-index: 200;
    padding: var(--space-sm) var(--space-md);
    background-color: var(--accent);
    color: var(--accent-contrast);
    font-family: var(--font-mono);
    font-size: var(--font-size-label);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.skip-link:focus {
    top: var(--space-md);
}

/* -------------------------------------------------------------
   2. Layout & film grain
   ------------------------------------------------------------- */
main {
    flex: 1;
    width: 100%;
    padding-top: var(--header-height);
}

.wrap {
    width: 100%;
    max-width: var(--max-width-wide);
    margin: 0 auto;
    padding-inline: var(--padding-horizontal-desktop);
}

@media (max-width: 1023px) {
    .wrap {
        padding-inline: var(--padding-horizontal-mobile);
    }
}

body::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 90;
    pointer-events: none;
    opacity: var(--grain-opacity);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 160px 160px;
}

body.page-article::before {
    display: none;
}

/* -------------------------------------------------------------
   3. Header & navigation
   ------------------------------------------------------------- */
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    height: var(--header-height);
    background-color: var(--header-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
}

.nav {
    max-width: var(--max-width-wide);
    height: 100%;
    margin: 0 auto;
    padding-inline: var(--padding-horizontal-desktop);
    display: flex;
    align-items: center;
    gap: var(--space-lg);
}

.logo {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: var(--font-weight-heading);
    letter-spacing: -0.02em;
    color: var(--text-primary);
}

.logo:hover {
    color: var(--text-primary);
    text-decoration: none;
}

.logo-mark {
    position: relative;
    flex: none;
    width: 1.125rem;
    height: 1.125rem;
    --vf-size: 0.4rem;
    --vf-weight: 2px;
    --vf-inset: 0;
}

.logo-mark::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.3125rem;
    height: 0.3125rem;
    border-radius: var(--radius-full);
    background-color: var(--accent);
    transform: translate(-50%, -50%);
}

.nav-links {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: var(--space-lg);
}

.nav-link {
    padding: var(--space-sm) 0;
    border-bottom: 2px solid transparent;
    font-family: var(--font-mono);
    font-size: var(--font-size-label);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    color: var(--text-secondary);
}

.nav-link:hover {
    color: var(--text-primary);
    text-decoration: none;
}

.nav-link.active {
    color: var(--text-primary);
    border-bottom-color: var(--accent);
}

.theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-full);
    color: var(--text-secondary);
    transition:
        color var(--transition-fast),
        border-color var(--transition-fast);
}

.theme-toggle:hover {
    color: var(--accent);
    border-color: var(--accent);
}

.theme-toggle svg {
    width: 1.25rem;
    height: 1.25rem;
}

[data-theme="light"] .theme-toggle svg {
    transform: rotate(30deg);
}

@media (max-width: 767px) {
    .nav {
        padding-inline: var(--padding-horizontal-mobile);
        gap: var(--space-md);
    }

    .nav-links {
        gap: var(--space-md);
    }

    .theme-toggle {
        width: 2.25rem;
        height: 2.25rem;
    }
}

/* -------------------------------------------------------------
   4. Footer
   ------------------------------------------------------------- */
.footer {
    margin-top: var(--section-spacing);
    padding: var(--space-xl) 0;
    border-top: 1px solid var(--border);
}

.footer-content {
    max-width: var(--max-width-wide);
    margin: 0 auto;
    padding-inline: var(--padding-horizontal-desktop);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--space-sm) var(--space-lg);
}

.footer-text {
    margin: 0;
    max-width: none;
    font-family: var(--font-mono);
    font-size: var(--font-size-label);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    color: var(--text-muted);
}

@media (max-width: 1023px) {
    .footer-content {
        padding-inline: var(--padding-horizontal-mobile);
    }
}

/* -------------------------------------------------------------
   5. Shared components
   ------------------------------------------------------------- */

/* Mono label: kickers, metadata, captions */
.label {
    margin-bottom: 0;
    max-width: none;
    font-family: var(--font-mono);
    font-size: var(--font-size-label);
    font-weight: 600;
    line-height: var(--line-height-small);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    color: var(--text-muted);
}

.label--accent {
    color: var(--accent);
}

.tag {
    display: inline-block;
    padding: 0.15em var(--space-sm);
    border: 1px solid var(--border-strong);
    font-family: var(--font-mono);
    font-size: var(--font-size-label);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    color: var(--text-muted);
    white-space: nowrap;
    user-select: none;
}

/* Viewfinder corner brackets, drawn on ::after.
   Tune with --vf-size, --vf-weight, --vf-inset, --vf-color. */
.vf {
    position: relative;
}

.vf::after {
    content: "";
    position: absolute;
    inset: var(--vf-inset);
    pointer-events: none;
    background:
        linear-gradient(var(--vf-color), var(--vf-color)) top left / var(--vf-size) var(--vf-weight) no-repeat,
        linear-gradient(var(--vf-color), var(--vf-color)) top left / var(--vf-weight) var(--vf-size) no-repeat,
        linear-gradient(var(--vf-color), var(--vf-color)) top right / var(--vf-size) var(--vf-weight) no-repeat,
        linear-gradient(var(--vf-color), var(--vf-color)) top right / var(--vf-weight) var(--vf-size) no-repeat,
        linear-gradient(var(--vf-color), var(--vf-color)) bottom left / var(--vf-size) var(--vf-weight) no-repeat,
        linear-gradient(var(--vf-color), var(--vf-color)) bottom left / var(--vf-weight) var(--vf-size) no-repeat,
        linear-gradient(var(--vf-color), var(--vf-color)) bottom right / var(--vf-size) var(--vf-weight) no-repeat,
        linear-gradient(var(--vf-color), var(--vf-color)) bottom right / var(--vf-weight) var(--vf-size) no-repeat;
}

/* Brackets that appear on hover / focus (animation lives in motion.css) */
.vf-hover::after {
    opacity: 0;
    transform: scale(1.03);
}

.vf-hover:hover::after,
.vf-hover:focus-visible::after,
.vf-hover:focus-within::after {
    opacity: 1;
    transform: scale(1);
}

/* Loading, empty and error states */
.state-message,
.empty-state,
.error-state {
    padding: var(--space-xl) 0;
    color: var(--text-secondary);
}

.state-message {
    font-family: var(--font-mono);
    font-size: var(--font-size-small);
}

.error-state h2 {
    margin-bottom: var(--space-md);
}

.error-state p,
.empty-state p {
    max-width: 40ch;
}

.loading-skeleton {
    display: flex;
    flex-direction: column;
}

.skeleton-card {
    display: grid;
    gap: var(--space-sm);
    padding: var(--space-xl) 0;
    border-bottom: 1px solid var(--border);
}

.skeleton-title,
.skeleton-text,
.skeleton-date {
    background-color: var(--bg-secondary);
}

.skeleton-title {
    height: 1.75rem;
    width: 70%;
}

.skeleton-text {
    height: 1rem;
}

.skeleton-text.short {
    width: 40%;
}

.skeleton-date {
    height: 0.75rem;
    width: 8rem;
}

@media (prefers-reduced-motion: no-preference) {
    .skeleton-card,
    .skeleton-header,
    .skeleton-content {
        animation: pulse 1.5s ease-in-out infinite;
    }
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

/* Reading progress line (shown and animated only by motion.css) */
.read-progress {
    display: none;
    position: fixed;
    top: var(--header-height);
    left: 0;
    width: 100%;
    height: 2px;
    z-index: 99;
    background-color: var(--accent);
    transform-origin: left center;
    pointer-events: none;
}

@media print {
    .header,
    .footer,
    .theme-toggle,
    .read-progress {
        display: none !important;
    }

    body::before {
        display: none;
    }

    * {
        color: #000 !important;
        background: #fff !important;
    }
}

/* @@next-section — page sections are appended below this marker by Tasks 3–5 */
```

- [ ] **Step 3: Update the four pages' head, body class, logo and footer**

Run from the repo root:

```bash
python3 - <<'EOF'
import pathlib

PAGES = ['index.html', 'articles.html', 'article.html', 'about.html']

OLD_HEAD_LINKS = '''  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Bodoni:ital,wght@0,700;1,400&family=Lora:wght@400;600&display=swap">
  <link rel="stylesheet" href="./css/main.css" />
'''
NEW_HEAD_LINKS = '''  <link rel="preload" href="./fonts/bricolage-grotesque-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="./fonts/lora-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="./css/tokens.css" />
  <link rel="stylesheet" href="./css/main.css" />
  <link rel="stylesheet" href="./css/legacy.css" />
'''
OLD_LOGO = '<a href="./index.html" class="logo">byteshutter</a>'
NEW_LOGO = '<a href="./index.html" class="logo"><span class="logo-mark vf" aria-hidden="true"></span>byteshutter</a>'
OLD_FOOTER = '<p class="footer-text">&copy; <span id="year"></span> byteshutter. All rights reserved.</p>'
NEW_FOOTER = '<p class="footer-text">&copy; <span id="year"></span> byteshutter</p>\n      <p class="footer-text">No analytics. No tracking.</p>'

for name in PAGES:
    path = pathlib.Path(name)
    text = path.read_text()
    for old, new in [(OLD_HEAD_LINKS, NEW_HEAD_LINKS), (OLD_LOGO, NEW_LOGO), (OLD_FOOTER, NEW_FOOTER)]:
        assert text.count(old) == 1, (name, old[:50])
        text = text.replace(old, new)
    assert text.count('<body>') == 1, name
    body_class = 'legacy-layout page-article' if name == 'article.html' else 'legacy-layout'
    text = text.replace('<body>', '<body class="%s">' % body_class)
    path.write_text(text)
    print('updated', name)
EOF
grep -c "fonts.googleapis" index.html articles.html article.html about.html
```
Expected: four `updated …` lines (no assertion error), then four `…:0` counts.

- [ ] **Step 4: Swap the theme icon for an aperture in `src/ts/theme.ts`**

Replace the `MOON_SVG` and `SUN_SVG` constants (lines 5–12) with:

```ts
const APERTURE_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="10" />
  <path d="M12 16.5L8.1 14.25L8.1 9.75L12 7.5L15.9 9.75L15.9 14.25Z" />
  <path d="M12 16.5L5.97 19.98M8.1 14.25L2.07 10.77M8.1 9.75V2.79M12 7.5L18.03 4.02M15.9 9.75L21.93 13.23M15.9 14.25V21.21" />
</svg>`;
```

and in `applyTheme`, replace `btn.innerHTML = t === 'dark' ? SUN_SVG : MOON_SVG;` with `btn.innerHTML = APERTURE_SVG;` (the `aria-label` line below it stays).

- [ ] **Step 5: Compile and sanity-check the CSS**

Run: `npm run compile && echo COMPILE_OK && python3 -c "t=open('css/main.css').read();print('braces', t.count('{'), t.count('}'))"`
Expected: `COMPILE_OK` and equal brace counts.

- [ ] **Step 6: Visual check**

Start the server: `(python3 -m http.server 3000 >/dev/null 2>&1 &)`.
In the browser tool, open `http://localhost:3000/index.html` and `…/articles.html` at desktop (default), tablet (`resize_window` preset `tablet`) and mobile; for light mode run in the page `localStorage.setItem('theme','light'); location.reload()`.
Expected: dark ink background with paper text; new header (logo mark + wordmark, mono nav links with orange underline on the active one, round aperture toggle that rotates slightly in light mode); footer with two mono lines; grain barely visible; legacy page bodies still readable in the new colours/fonts (layout may look rough — it is replaced in Tasks 3–5). Console (`read_console_messages`) has no errors and no failed font requests.

- [ ] **Step 7: Commit**

```bash
git add css/main.css css/legacy.css index.html articles.html article.html about.html src/ts/theme.ts
git commit -m "style: new base, header, footer and aperture theme toggle

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Home page (writing first)

**Files:**
- Create: `src/ts/feed.ts`, `src/ts/home.ts`
- Modify: `index.html`, `css/main.css` (append at the marker)

**Interfaces:**
- Consumes: `.wrap`, `.label`, `.vf`, `.vf-hover`, `.state-message` (Task 2).
- Produces (`src/ts/feed.ts`, used by Tasks 3 and 4):
  - `interface ArticleFeed { title: string; excerpt: string; created_at: string; slug: string; tags?: string[] }`
  - `escapeHtml(text: string): string`
  - `fetchArticleFeed(): Promise<ArticleFeed[]>` (newest first)
  - `frameNumbers(articles: ArticleFeed[]): Map<string, number>`
  - `frameLabel(n: number): string` → `"No. 01"`
  - `formatShortDate(iso: string): string` → `"06 MAY 2020"`
  - `renderFrameRow(article: ArticleFeed, number: number, headingLevel: 2 | 3): string`
  - `renderEmptyFrameRow(number: number): string`
- Produces (CSS): `.frame-list`, `.frame-row` (+ `--empty`), `.frame-no`, `.frame-body`, `.frame-title`, `.frame-excerpt`, `.frame-arrow`.

- [ ] **Step 1: Write `src/ts/feed.ts`**

```ts
/* Shared article-feed helpers for ByteShutter (home, articles list, article detail) */

export interface ArticleFeed {
  title: string;
  excerpt: string;
  created_at: string;
  slug: string;
  tags?: string[];
}

interface ArticlesFeedResponse {
  articles: ArticleFeed[];
}

function timeOf(article: ArticleFeed): number {
  return Date.parse(article.created_at) || 0;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Loads data/articles.json, newest article first. */
export async function fetchArticleFeed(): Promise<ArticleFeed[]> {
  const res = await fetch('./data/articles.json');
  if (!res.ok) throw new Error('Failed to load articles (' + res.status + ')');
  const data: ArticlesFeedResponse = await res.json();
  return (data.articles || []).slice().sort(function (a: ArticleFeed, b: ArticleFeed): number {
    return timeOf(b) - timeOf(a);
  });
}

/** Frame number per slug: the oldest article is 1, numbered by created_at ascending. */
export function frameNumbers(articles: ArticleFeed[]): Map<string, number> {
  const numbers = new Map<string, number>();
  articles
    .slice()
    .sort(function (a: ArticleFeed, b: ArticleFeed): number { return timeOf(a) - timeOf(b); })
    .forEach(function (article: ArticleFeed, index: number): void {
      numbers.set(article.slug, index + 1);
    });
  return numbers;
}

export function frameLabel(n: number): string {
  return 'No. ' + String(n).padStart(2, '0');
}

/** "06 MAY 2020" — formatted in UTC so the day never shifts with the visitor's timezone. */
export function formatShortDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
    .toUpperCase();
}

export function renderFrameRow(article: ArticleFeed, number: number, headingLevel: 2 | 3): string {
  const tag = article.tags && article.tags.length > 0 ? article.tags[0] : '';
  const date = article.created_at ? formatShortDate(article.created_at) : '';
  const meta = [tag, date].filter(Boolean).map(escapeHtml).join(' · ');
  const h = 'h' + headingLevel;
  return '<a href="./article.html#' + article.slug + '" class="frame-row vf vf-hover">' +
    '<span class="frame-no">' + frameLabel(number) + '</span>' +
    '<div class="frame-body">' +
      (meta ? '<p class="label">' + meta + '</p>' : '') +
      '<' + h + ' class="frame-title">' + escapeHtml(article.title) + '</' + h + '>' +
      '<p class="frame-excerpt">' + escapeHtml(article.excerpt) + '</p>' +
    '</div>' +
    '<span class="frame-arrow" aria-hidden="true">→</span>' +
  '</a>';
}

export function renderEmptyFrameRow(number: number): string {
  return '<div class="frame-row frame-row--empty">' +
    '<span class="frame-no">' + frameLabel(number) + '</span>' +
    '<div class="frame-body"><p class="frame-title">Next frame is in the developing tray.</p></div>' +
  '</div>';
}
```

- [ ] **Step 2: Write `src/ts/home.ts`**

```ts
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
```

- [ ] **Step 3: Compile and check module resolution**

Run: `npm run compile 2>&1 | tail -5; ls js/feed.js js/home.js`
Expected: no errors and both files exist. **If** `tsc` reports `TS2307: Cannot find module './feed.js'`, add `"moduleResolution": "bundler"` to `compilerOptions` in `tsconfig.browser.json` and re-run; expected result then: no errors. Also confirm the emitted import keeps its extension: `head -3 js/home.js` must show `from './feed.js'`.

- [ ] **Step 4: Replace the `<main>` of `index.html`**

```bash
python3 - <<'EOF'
import pathlib

path = pathlib.Path('index.html')
text = path.read_text()

NEW_MAIN = '''<main id="main-content">

    <!-- Hero -->
    <section class="hero wrap" aria-labelledby="hero-title">
      <p class="label label--accent">Code · Cameras · Books</p>
      <h1 id="hero-title" class="hero-title">
        Hey there, web surfer!
        <span class="hero-title-sub">Welcome to this little corner of the internet.</span>
      </h1>
      <p class="hero-note">
        No analytics, no tracking, just a private place to explore.<br>
        Rest, read articles, see some photos, and share your thoughts only if you want to.
      </p>
      <figure class="hero-art vf">
        <img src="./images/highlighted/hero_image.jpg" alt="Illustration of a film camera next to a laptop on a desk, with the sea and orange hills outside the window" width="3014" height="1223" />
      </figure>
    </section>

    <!-- 01 Latest writing -->
    <section class="home-section wrap reveal" aria-labelledby="latest-title">
      <header class="section-head">
        <span class="section-index" aria-hidden="true">01</span>
        <h2 id="latest-title">Latest writing</h2>
        <a class="section-link label" href="./articles.html">All articles →</a>
      </header>
      <div id="latest-writing" class="frame-list" aria-live="polite">
        <p class="state-message">Developing the latest frames…</p>
      </div>
    </section>

    <!-- 02 Highlighted photo -->
    <section class="home-section wrap reveal" aria-labelledby="photo-title">
      <header class="section-head">
        <span class="section-index" aria-hidden="true">02</span>
        <h2 id="photo-title">Highlighted photo</h2>
      </header>
      <div class="filmstrip">
        <figure class="film-frame vf">
          <img src="./images/highlighted/orange_pattern.jpg" alt="A row of orange rental bikes knocked over on a city street while a runner jogs past" width="3036" height="1708" loading="lazy" />
        </figure>
      </div>
      <div class="photo-meta">
        <p class="label">NIKON D3100 · 2024-02-13</p>
        <p class="photo-note">Orange, who will fix this mess?</p>
      </div>
    </section>

    <!-- 03 Books -->
    <section class="home-section wrap reveal" aria-labelledby="books-title">
      <header class="section-head">
        <span class="section-index" aria-hidden="true">03</span>
        <h2 id="books-title">Books</h2>
      </header>

      <article class="reading-card">
        <figure class="reading-cover vf">
          <img src="./images/book_cover/ai_engineer_book_cover.jpg" alt="AI Engineering book cover" loading="lazy" />
        </figure>
        <div class="reading-info">
          <p class="label label--accent">Currently reading</p>
          <h3>AI Engineering: Building Applications with Foundation Models</h3>
          <p class="reading-author">by Chip Huyen</p>
          <p class="reading-note">
            Why I'm reading it: We're living in the age of AI, so who am I to skip a book on the subject?
          </p>
        </div>
      </article>

      <h3 class="label shelf-title">Recently read</h3>
      <ul class="shelf">
        <li class="shelf-item">
          <figure class="shelf-cover vf">
            <img src="./images/book_cover/the_pragmatic_programmer_book_cover.jpg" alt="The Pragmatic Programmer cover" loading="lazy" />
          </figure>
          <h4>The Pragmatic Programmer</h4>
          <p class="shelf-author">David Thomas &amp; Andrew Hunt</p>
          <details class="shelf-review">
            <summary>About the book</summary>
            <p>The Pragmatic Programmer: From Journeyman to Master is a book about computer programming and software engineering, written by Andrew Hunt and David Thomas and published in October 1999.</p>
          </details>
        </li>
        <li class="shelf-item">
          <figure class="shelf-cover vf">
            <img src="./images/book_cover/philosophy_software_designer_book_cover.jpg" alt="A Philosophy of Software Design cover" loading="lazy" />
          </figure>
          <h4>A Philosophy of Software Design</h4>
          <p class="shelf-author">John Ousterhout</p>
          <details class="shelf-review">
            <summary>About the book</summary>
            <p>"A Philosophy of Software Design" by John Ousterhout offers timeless principles for creating clean, maintainable code. It emphasizes deep modules, managing complexity, and thoughtful abstractions, making it a must-read for developers aiming to write better software.</p>
          </details>
        </li>
        <li class="shelf-item">
          <figure class="shelf-cover vf">
            <img src="./images/book_cover/oneThousandNineHundredEightyFourBookCover.jpg" alt="1984 cover" loading="lazy" />
          </figure>
          <h4>1984</h4>
          <p class="shelf-author">George Orwell</p>
          <details class="shelf-review">
            <summary>About the book</summary>
            <p>George Orwell's 1984 is a dystopian masterpiece exploring themes of totalitarianism, surveillance, and the manipulation of truth. Set in a bleak future, it follows Winston Smith as he struggles against an oppressive regime that seeks to control every aspect of life.</p>
          </details>
        </li>
      </ul>
    </section>

    <!-- 04 Interesting articles -->
    <section class="home-section wrap reveal" aria-labelledby="links-title">
      <header class="section-head">
        <span class="section-index" aria-hidden="true">04</span>
        <h2 id="links-title">Interesting articles</h2>
      </header>
      <ul class="link-list">
        <li>
          <a href="https://blog.pragmaticengineer.com/stack-overflow-is-almost-dead/" target="_blank" rel="noopener noreferrer">Stack overflow is almost dead</a>
          <p class="link-note">Thanks for helping me to start my journey!</p>
        </li>
        <li>
          <a href="https://tidyfirst.substack.com/p/canon-tdd" target="_blank" rel="noopener noreferrer">Canon TDD</a>
          <p class="link-note">It might take a mental shift, but it can be worth it!</p>
        </li>
        <li>
          <a href="https://martinfowler.com/articles/2025-nature-abstraction.html" target="_blank" rel="noopener noreferrer">LLMs bring new nature of abstraction</a>
          <p class="link-note">LLMs are really transforming software development with non-determinism, marking a shift as big as moving from assembly to high-level languages.</p>
        </li>
      </ul>
    </section>

    <!-- 05 About -->
    <section class="home-section wrap reveal" aria-labelledby="about-title">
      <header class="section-head">
        <span class="section-index" aria-hidden="true">05</span>
        <h2 id="about-title">About me</h2>
      </header>
      <p class="about-teaser">
        By the way, I'm Andrea, nice to meet you! If you're curious about me,
        there's <a href="./about.html">a whole section on my background</a>. But if you're too lazy to
        read that, well, now you know my name!
      </p>
    </section>

  </main>'''

start = text.index('<main id="main-content">')
end = text.index('</main>') + len('</main>')
text = text[:start] + NEW_MAIN + text[end:]

OLD_LEGACY = '  <link rel="stylesheet" href="./css/legacy.css" />\n'
assert text.count(OLD_LEGACY) == 1
text = text.replace(OLD_LEGACY, '')
assert text.count('<body class="legacy-layout">') == 1
text = text.replace('<body class="legacy-layout">', '<body>')
OLD_SCRIPT = '  <script type="module" src="./js/theme.js"></script>\n'
assert text.count(OLD_SCRIPT) == 1
text = text.replace(OLD_SCRIPT, OLD_SCRIPT + '  <script type="module" src="./js/home.js"></script>\n')
assert text.count('<div') == text.count('</div>')
path.write_text(text)
print('index.html updated')
EOF
```
Expected: `index.html updated` (no assertion error).

- [ ] **Step 5: Append the home and frame-row CSS to `css/main.css`**

Replace the line `/* @@next-section — page sections are appended below this marker by Tasks 3–5 */` with the block below followed by the same marker line again:

```css
/* -------------------------------------------------------------
   6. Frame rows (home "Latest writing" and the articles list)
   ------------------------------------------------------------- */
.frame-list {
    display: flex;
    flex-direction: column;
}

.frame-row {
    --vf-inset: 0.25rem;
    display: grid;
    grid-template-columns: 5.5rem minmax(0, 1fr) auto;
    gap: var(--space-lg);
    align-items: start;
    padding: var(--space-xl) var(--space-md);
    border-bottom: 1px solid var(--border);
    color: inherit;
}

.frame-row:hover {
    color: inherit;
    text-decoration: none;
}

.frame-no {
    padding-top: 0.35em;
    font-family: var(--font-mono);
    font-size: var(--font-size-label);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    color: var(--accent);
    white-space: nowrap;
}

.frame-body {
    min-width: 0;
}

.frame-body .label {
    margin-bottom: var(--space-sm);
}

.frame-title {
    margin: 0 0 var(--space-sm);
    font-size: var(--font-size-h3);
    transition: color var(--transition-fast);
}

.frame-row:hover .frame-title,
.frame-row:focus-visible .frame-title {
    color: var(--accent);
}

.frame-excerpt {
    margin: 0;
    color: var(--text-secondary);
}

.frame-arrow {
    padding-top: 0.2em;
    font-family: var(--font-mono);
    font-size: 1.25rem;
    color: var(--text-muted);
    transition: color var(--transition-fast);
}

.frame-row:hover .frame-arrow,
.frame-row:focus-visible .frame-arrow {
    color: var(--accent);
}

.frame-row--empty .frame-no,
.frame-row--empty .frame-title {
    color: var(--text-muted);
}

.frame-row--empty .frame-title {
    margin: 0;
    font-family: var(--font-mono);
    font-size: var(--font-size-small);
    font-weight: 400;
    letter-spacing: 0;
}

@media (max-width: 767px) {
    .frame-row {
        grid-template-columns: 1fr;
        gap: var(--space-sm);
        padding: var(--space-lg) var(--space-sm);
    }

    .frame-arrow {
        display: none;
    }
}

/* -------------------------------------------------------------
   7. Home
   ------------------------------------------------------------- */
.hero {
    padding-top: var(--space-3xl);
    padding-bottom: var(--space-2xl);
}

.hero-title {
    margin: var(--space-md) 0 var(--space-xl);
    font-size: var(--font-size-display);
    line-height: var(--line-height-display);
    letter-spacing: -0.035em;
}

.hero-title-sub {
    color: var(--text-muted);
}

.hero-note {
    max-width: 52ch;
    margin-bottom: var(--space-2xl);
    font-size: 1.125rem;
    color: var(--text-secondary);
}

.hero-art {
    --vf-inset: 1rem;
    margin: 0;
}

.hero-art img {
    width: 100%;
}

.home-section {
    padding-top: var(--space-2xl);
    padding-bottom: var(--space-2xl);
}

.section-head {
    display: flex;
    align-items: baseline;
    gap: var(--space-md);
    margin-bottom: var(--space-xl);
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--border);
}

.section-head h2 {
    margin: 0;
}

.section-index {
    font-family: var(--font-mono);
    font-size: var(--font-size-label);
    letter-spacing: var(--tracking-label);
    color: var(--accent);
}

.section-link {
    margin-left: auto;
    color: var(--accent);
    white-space: nowrap;
}

/* Photo: film strip */
.filmstrip {
    position: relative;
    display: flex;
    gap: var(--space-md);
    padding: 2.25rem var(--space-lg);
    overflow-x: auto;
    background-color: var(--film);
}

.filmstrip::before,
.filmstrip::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 0.75rem;
    pointer-events: none;
    background: repeating-linear-gradient(90deg, var(--bg-primary) 0 0.875rem, transparent 0.875rem 1.75rem);
}

.filmstrip::before {
    top: 0.75rem;
}

.filmstrip::after {
    bottom: 0.75rem;
}

.film-frame {
    --vf-inset: 0.75rem;
    flex: 0 0 auto;
    width: min(100%, 52rem);
    margin: 0;
}

.film-frame img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
}

.photo-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--space-sm) var(--space-md);
    margin-top: var(--space-md);
}

.photo-note {
    margin: 0;
    font-style: italic;
    color: var(--text-secondary);
}

/* Books */
.reading-card {
    display: grid;
    grid-template-columns: 12rem minmax(0, 1fr);
    gap: var(--space-xl);
    align-items: center;
    padding-bottom: var(--space-2xl);
}

.reading-cover {
    --vf-inset: 0.5rem;
    margin: 0;
}

.reading-cover img,
.shelf-cover img {
    width: 100%;
    aspect-ratio: 2 / 3;
    object-fit: cover;
}

.reading-info h3 {
    margin: var(--space-sm) 0;
}

.reading-author,
.shelf-author {
    margin-bottom: var(--space-md);
    font-family: var(--font-mono);
    font-size: var(--font-size-small);
    color: var(--text-muted);
}

.reading-note {
    color: var(--text-secondary);
}

.shelf-title {
    margin: 0 0 var(--space-lg);
}

.shelf {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
    gap: var(--space-xl) var(--space-lg);
}

.shelf-item {
    margin: 0;
}

.shelf-cover {
    --vf-inset: 0.5rem;
    margin: 0;
}

.shelf-item h4 {
    margin: var(--space-md) 0 var(--space-xs);
    line-height: 1.25;
}

.shelf-author {
    margin-bottom: var(--space-sm);
}

.shelf-review summary {
    cursor: pointer;
    list-style: none;
    font-family: var(--font-mono);
    font-size: var(--font-size-label);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    color: var(--accent);
}

.shelf-review summary::-webkit-details-marker {
    display: none;
}

.shelf-review summary::after {
    content: " +";
}

.shelf-review[open] summary::after {
    content: " –";
}

.shelf-review p {
    margin-top: var(--space-sm);
    font-size: var(--font-size-small);
    color: var(--text-secondary);
}

/* Links */
.link-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.link-list li {
    margin: 0;
    padding: var(--space-lg) 0;
    border-bottom: 1px solid var(--border);
}

.link-list a {
    font-family: var(--font-heading);
    font-size: var(--font-size-h4);
    font-weight: var(--font-weight-heading);
}

.link-list a::after {
    content: " ↗";
    font-family: var(--font-mono);
    font-weight: 400;
}

.link-note {
    max-width: 60ch;
    margin: var(--space-xs) 0 0;
    color: var(--text-secondary);
}

.about-teaser {
    max-width: 40ch;
    font-size: 1.25rem;
    color: var(--text-secondary);
}

@media (max-width: 767px) {
    .hero {
        padding-top: var(--space-2xl);
    }

    .hero-art img {
        min-height: 12.5rem;
        object-fit: cover;
        object-position: 38% center;
    }

    .filmstrip {
        padding: 1.75rem var(--space-sm);
    }

    .filmstrip::before {
        top: 0.5rem;
    }

    .filmstrip::after {
        bottom: 0.5rem;
    }

    .reading-card {
        grid-template-columns: 1fr;
    }

    .reading-cover {
        max-width: 12rem;
    }
}

/* @@next-section — page sections are appended below this marker by Tasks 4–5 */
```

- [ ] **Step 6: Compile, then visually verify the home page**

Run: `npm run compile && echo COMPILE_OK && python3 -c "t=open('css/main.css').read();print('braces', t.count('{'), t.count('}'))"`
Expected: `COMPILE_OK`, equal brace counts.

In the browser, open `http://localhost:3000/index.html` (server from Task 2) at desktop, tablet and mobile, in dark and light.
Expected: big two-tone headline; panoramic hero illustration with orange corner brackets; "01 Latest writing" shows one row `No. 01 · SWIFT · 06 MAY 2020 · "Operators: A Comprehensive Technical Guide"` plus a dimmed `No. 02 — Next frame is in the developing tray.` row; hovering the row shows orange brackets and an orange title; the photo sits in a dark film strip with sprocket holes and the mono caption `NIKON D3100 · 2024-02-13`; books show the large current-reading card and three covers with "About the book +" toggles that open/close; links list with `↗`; no horizontal scroll at 375 px; no console errors.

- [ ] **Step 7: Commit**

```bash
git add src/ts/feed.ts src/ts/home.ts index.html css/main.css
git commit -m "style: writing-first home page with frame rows and film-strip photo

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Articles list and article page

**Files:**
- Modify: `src/ts/articles.ts`, `src/ts/article.ts`, `articles.html`, `article.html`, `css/main.css` (append at the marker)

**Interfaces:**
- Consumes: everything `feed.ts` exports (Task 3), `.frame-list`/`.frame-row` CSS (Task 3), `.label`, `.tag`, `.vf`, skeleton classes, `.read-progress` (Task 2).
- Produces (CSS): `.page-head`, `.page-lede`, `.article-content`, `.article`, `.article-header`, `.article-kicker`, `.article-title`, `.article-meta`, `.article-tags`, `.article-body` typography, `.article-figure`, `.article-footer`, `.back-link`, `.article-not-found`, article skeleton classes.

- [ ] **Step 1: Rewrite `src/ts/articles.ts`**

```ts
/* Articles list for ByteShutter */

import { escapeHtml, fetchArticleFeed, frameNumbers, renderFrameRow } from './feed.js';

function showSkeleton(container: HTMLElement): void {
  container.innerHTML =
    '<div class="loading-skeleton">' +
      '<div class="skeleton-card"><div class="skeleton-title"></div><div class="skeleton-text"></div><div class="skeleton-text short"></div><div class="skeleton-date"></div></div>' +
      '<div class="skeleton-card"><div class="skeleton-title"></div><div class="skeleton-text"></div><div class="skeleton-text short"></div><div class="skeleton-date"></div></div>' +
      '<div class="skeleton-card"><div class="skeleton-title"></div><div class="skeleton-text"></div><div class="skeleton-text short"></div><div class="skeleton-date"></div></div>' +
    '</div>';
}

async function loadArticles(): Promise<void> {
  const container = document.getElementById('articles-list');
  if (!container) return;

  showSkeleton(container);

  try {
    const articles = await fetchArticleFeed();

    if (articles.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No articles yet.</p></div>';
      return;
    }

    const numbers = frameNumbers(articles);
    container.innerHTML = articles.map(function (article): string {
      return renderFrameRow(article, numbers.get(article.slug) ?? 0, 2);
    }).join('');
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'An unexpected error occurred.';
    container.innerHTML =
      '<div class="error-state">' +
        '<h2>Failed to load articles</h2>' +
        '<p>' + escapeHtml(msg) + '</p>' +
      '</div>';
  }
}

document.addEventListener('DOMContentLoaded', loadArticles);

export {};
```

- [ ] **Step 2: Rewrite `src/ts/article.ts`**

```ts
/* Article detail for ByteShutter
 * marked.min.js is loaded as a classic (non-module) script in article.html,
 * which guarantees it executes before any deferred module scripts (including this one).
 * Do NOT add type="module" to the marked.min.js script tag in article.html.
 */

import { escapeHtml, fetchArticleFeed, formatShortDate, frameLabel, frameNumbers } from './feed.js';

// marked v15+ API: options are passed directly to parse(), setOptions() is removed
declare const marked: {
  parse(src: string, options?: { gfm?: boolean; breaks?: boolean }): string;
};

interface ArticleDetail {
  title: string;
  excerpt?: string;
  created_at: string;
  slug: string;
  tags?: string[];
  content: string;
}

function buildTagsHtml(tags: string[] | undefined): string {
  if (!tags || tags.length === 0) return '';
  return tags.map(function (t: string): string {
    return '<span class="tag">' + escapeHtml(t) + '</span>';
  }).join('');
}

function showError(msg: string): void {
  const skeleton = document.getElementById('article-skeleton');
  const errorEl = document.getElementById('article-error');
  const errorMsg = document.getElementById('article-error-msg');
  if (skeleton) skeleton.style.display = 'none';
  if (errorEl) errorEl.style.display = 'block';
  if (errorMsg) errorMsg.textContent = msg;
}

function injectStructuredData(article: ArticleDetail): void {
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.text = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    datePublished: article.created_at,
    author: { '@type': 'Person', name: 'Andrea Rinaldi' },
    keywords: (article.tags || []).join(',')
  });
  document.head.appendChild(ld);
}

/** "No. 01" for this article, or '' if the feed cannot be loaded. */
async function resolveFrameLabel(slug: string): Promise<string> {
  try {
    const number = frameNumbers(await fetchArticleFeed()).get(slug);
    return number === undefined ? '' : frameLabel(number);
  } catch {
    return '';
  }
}

/** Puts the code language (from marked's language-* class) on the <pre> for the CSS label. */
function labelCodeBlocks(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('pre > code').forEach(function (code: HTMLElement): void {
    const match = /(?:^|\s)language-([\w+#-]+)/.exec(code.className);
    const pre = code.parentElement;
    if (match && pre) pre.setAttribute('data-lang', match[1]);
  });
}

/** Wraps each image in <figure><div class="vf">…</div><figcaption>…</figcaption></figure>. */
function frameImages(root: HTMLElement): void {
  root.querySelectorAll<HTMLImageElement>('img').forEach(function (img: HTMLImageElement): void {
    const caption = img.getAttribute('title') || img.getAttribute('alt') || '';
    const parent = img.parentElement;
    const onlyChild =
      parent !== null &&
      parent.tagName === 'P' &&
      parent.children.length === 1 &&
      (parent.textContent || '').trim() === '';
    const host: Element = onlyChild && parent ? parent : img;

    const figure = document.createElement('figure');
    figure.className = 'article-figure';
    const frame = document.createElement('div');
    frame.className = 'vf';

    host.replaceWith(figure);
    img.loading = 'lazy';
    frame.appendChild(img);
    figure.appendChild(frame);

    if (caption) {
      const figcaption = document.createElement('figcaption');
      figcaption.className = 'label';
      figcaption.textContent = caption;
      figure.appendChild(figcaption);
    }
  });
}

async function loadArticle(): Promise<void> {
  const slug = window.location.hash.slice(1);

  if (!slug) {
    showError('No article slug specified.');
    return;
  }

  try {
    const [res, frame] = await Promise.all([
      fetch('./data/' + encodeURIComponent(slug) + '.json'),
      resolveFrameLabel(slug)
    ]);
    if (!res.ok) throw new Error('Article not found (' + res.status + ')');
    const article: ArticleDetail = await res.json();

    document.title = article.title + ' | ByteShutter';
    const metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (metaDesc && article.excerpt) metaDesc.setAttribute('content', article.excerpt);

    injectStructuredData(article);

    const words = article.content ? article.content.split(/\s+/).filter(Boolean).length : 0;
    const readTime = Math.max(1, Math.round(words / 200));

    const skeleton = document.getElementById('article-skeleton');
    const content = document.getElementById('article-content-wrapper');
    if (skeleton) skeleton.style.display = 'none';
    if (content) content.style.display = 'block';

    const titleEl = document.getElementById('article-title');
    if (titleEl) titleEl.textContent = article.title;

    const dateEl = document.getElementById('article-date');
    if (dateEl && article.created_at) {
      dateEl.textContent = formatShortDate(article.created_at);
      dateEl.setAttribute('datetime', article.created_at);
    }

    const readTimeEl = document.getElementById('article-read-time');
    if (readTimeEl) readTimeEl.textContent = readTime + ' min read';

    const kickerEl = document.getElementById('article-kicker');
    if (kickerEl) {
      const kickerTag = article.tags && article.tags.length > 0 ? article.tags[0] : '';
      kickerEl.textContent = [frame, kickerTag].filter(Boolean).join(' · ');
    }

    const tagsEl = document.getElementById('article-tags');
    if (tagsEl) tagsEl.innerHTML = buildTagsHtml(article.tags);

    const bodyEl = document.getElementById('article-body');
    if (bodyEl && article.content) {
      bodyEl.innerHTML = marked.parse(article.content, { gfm: true, breaks: false });
      labelCodeBlocks(bodyEl);
      frameImages(bodyEl);
    }

  } catch (e) {
    showError(e instanceof Error ? e.message : 'Failed to load article.');
  }
}

document.addEventListener('DOMContentLoaded', loadArticle);

export {};
```

- [ ] **Step 3: Compile**

Run: `npm run compile 2>&1 | tail -5 && echo COMPILE_OK`
Expected: `COMPILE_OK` with no errors (unused-local checks pass: every import is used).

- [ ] **Step 4: Update `articles.html` and `article.html`**

```bash
python3 - <<'EOF'
import pathlib

LEGACY_LINK = '  <link rel="stylesheet" href="./css/legacy.css" />\n'

# ---- articles.html ----
path = pathlib.Path('articles.html')
text = path.read_text()
start = text.index('<main id="main-content">')
end = text.index('</main>') + len('</main>')
NEW_MAIN = '''<main id="main-content">
    <div class="wrap">
      <header class="page-head">
        <p class="label label--accent">The archive</p>
        <h1>Articles</h1>
        <p class="page-lede">Everything I've written, newest frame first.</p>
      </header>
      <div id="articles-list" class="frame-list" aria-live="polite">
        <!-- Content loaded by articles.js -->
        <div class="loading-skeleton">
          <div class="skeleton-card">
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
            <div class="skeleton-date"></div>
          </div>
          <div class="skeleton-card">
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
            <div class="skeleton-date"></div>
          </div>
          <div class="skeleton-card">
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
            <div class="skeleton-date"></div>
          </div>
        </div>
      </div>
    </div>
  </main>'''
text = text[:start] + NEW_MAIN + text[end:]
assert text.count(LEGACY_LINK) == 1
text = text.replace(LEGACY_LINK, '')
assert text.count('<body class="legacy-layout">') == 1
text = text.replace('<body class="legacy-layout">', '<body>')
assert text.count('<div') == text.count('</div>')
path.write_text(text)
print('articles.html updated')

# ---- article.html ----
path = pathlib.Path('article.html')
text = path.read_text()
assert text.count(LEGACY_LINK) == 1
text = text.replace(LEGACY_LINK, '')
assert text.count('<body class="legacy-layout page-article">') == 1
text = text.replace('<body class="legacy-layout page-article">', '<body class="page-article">')
OLD_HEADER = '  <header class="header">'
assert text.count(OLD_HEADER) == 1
text = text.replace(OLD_HEADER, '  <div class="read-progress" aria-hidden="true"></div>\n\n' + OLD_HEADER)
OLD_ERR = '<div id="article-error" class="article-not-found" style="display:none;">'
assert text.count(OLD_ERR) == 1
text = text.replace(OLD_ERR, '<div id="article-error" class="article-not-found wrap" style="display:none;">')
path.write_text(text)
print('article.html updated')
EOF
```
Expected: both `… updated` lines.

- [ ] **Step 5: Append the articles and article CSS to `css/main.css`**

Replace the marker line `/* @@next-section — page sections are appended below this marker by Tasks 4–5 */` with the block below followed by the marker (now saying Task 5):

```css
/* -------------------------------------------------------------
   8. Articles list
   ------------------------------------------------------------- */
.page-head {
    padding: var(--space-3xl) 0 var(--space-xl);
}

.page-head h1 {
    margin: var(--space-md) 0;
    font-size: var(--font-size-display);
    line-height: var(--line-height-display);
    letter-spacing: -0.035em;
}

.page-lede {
    font-size: 1.25rem;
    color: var(--text-secondary);
}

.page-head + .frame-list {
    border-top: 1px solid var(--border);
}

/* -------------------------------------------------------------
   9. Article detail
   ------------------------------------------------------------- */
.article-content {
    width: 100%;
    max-width: calc(52rem + 2 * var(--padding-horizontal-desktop));
    margin: 0 auto;
    padding: var(--space-3xl) var(--padding-horizontal-desktop);
    overflow-wrap: break-word;
}

.article {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
}

.article-header {
    padding-bottom: var(--space-xl);
    border-bottom: 1px solid var(--border);
}

.article-kicker {
    display: block;
    margin-bottom: var(--space-md);
    font-family: var(--font-mono);
    font-size: var(--font-size-label);
    font-weight: 600;
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    color: var(--accent);
}

.article-title {
    margin-bottom: var(--space-lg);
    font-size: var(--font-size-h1);
    line-height: var(--line-height-h1);
}

.article-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm) var(--space-md);
    font-family: var(--font-mono);
    font-size: var(--font-size-label);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    color: var(--text-muted);
}

.read-time::before {
    content: "·";
    margin-right: var(--space-md);
}

.article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    margin-top: var(--space-lg);
}

.article-body {
    max-width: var(--max-width-article);
}

.article-body h2,
.article-body h3,
.article-body h4 {
    margin: var(--space-2xl) 0 var(--space-md);
}

.article-body p {
    max-width: none;
    margin-bottom: var(--space-lg);
}

.article-body ul,
.article-body ol {
    margin: var(--space-lg) 0;
    padding-left: var(--space-xl);
}

.article-body li {
    margin-bottom: var(--space-sm);
}

.article-body a {
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
}

.article-body blockquote {
    margin: var(--space-lg) 0;
    padding: var(--space-md) var(--space-lg);
}

.article-body blockquote p {
    margin: 0;
}

.article-body table {
    display: block;
    margin: var(--space-lg) 0;
    overflow-x: auto;
    font-size: var(--font-size-small);
}

.article-body th,
.article-body td {
    padding: var(--space-sm) var(--space-md);
    border-bottom: 1px solid var(--border);
    text-align: left;
}

.article-body th {
    border-bottom-color: var(--border-strong);
    font-family: var(--font-mono);
    font-size: var(--font-size-label);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    color: var(--text-muted);
}

.article-figure {
    margin: var(--space-xl) 0;
}

.article-figure .vf {
    --vf-inset: 0.5rem;
}

.article-figure img {
    width: 100%;
    height: auto;
}

.article-figure figcaption {
    margin-top: var(--space-sm);
}

.article-footer {
    padding-top: var(--space-xl);
    border-top: 1px solid var(--border);
}

.back-link {
    display: inline-flex;
    font-family: var(--font-mono);
    font-size: var(--font-size-label);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
}

.article-not-found {
    padding-top: var(--space-3xl);
    padding-bottom: var(--space-3xl);
}

.article-not-found p {
    color: var(--text-secondary);
    margin-bottom: var(--space-lg);
}

.skeleton-header {
    margin-bottom: var(--space-xl);
    padding-bottom: var(--space-xl);
    border-bottom: 1px solid var(--border);
}

.skeleton-title-lg {
    width: 80%;
    height: 2.5rem;
    margin-bottom: var(--space-lg);
    background-color: var(--bg-secondary);
}

.skeleton-meta {
    width: 12rem;
    height: 1rem;
    background-color: var(--bg-secondary);
}

.skeleton-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
}

.skeleton-paragraph {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
}

@media (max-width: 1023px) {
    .article-content {
        padding-inline: var(--padding-horizontal-mobile);
    }
}

@media (max-width: 767px) {
    .article-content {
        padding-top: var(--space-2xl);
        padding-bottom: var(--space-2xl);
    }

    .page-head {
        padding-top: var(--space-2xl);
    }

    pre {
        font-size: 0.8rem;
        padding: var(--space-md);
    }
}

/* @@next-section — the About section is appended below this marker by Task 5 */
```

- [ ] **Step 6: Verify the articles list and article page**

Run: `npm run compile && npm run convert 2>&1 | tail -2 && python3 -c "t=open('css/main.css').read();print('braces', t.count('{'), t.count('}'))"`
Expected: no errors, equal brace counts.

Browser, dark and light, desktop/tablet/mobile:
- `http://localhost:3000/articles.html` → big "Articles" headline with "The archive" label, one frame row `No. 01 · SWIFT · 06 MAY 2020`, hover shows brackets, title orange.
- `http://localhost:3000/article.html#operators-a-comprehensive-technical-guide` → kicker `No. 01 · swift` (uppercased), big title, mono meta `06 MAY 2020 · 7 MIN READ`, Lora body at ~65ch, code blocks with a `SWIFT` label and orange left rule that scroll horizontally, no film grain.
- `http://localhost:3000/article.html#testing-article-visualization-images-code-and-tables` (local test data) → images appear in a viewfinder frame with a mono caption, tables styled with mono headers. If that file is missing, skip this bullet.
- `http://localhost:3000/article.html#does-not-exist` → the "Article not found" state with a "← More Articles" mono link.
Expected overall: no horizontal scroll at 375 px, no console errors.

- [ ] **Step 7: Commit**

```bash
git add src/ts/articles.ts src/ts/article.ts articles.html article.html css/main.css
git commit -m "style: frame-numbered articles list and darkroom article page

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 5: About page and legacy cleanup

**Files:**
- Modify: `about.html`, `css/main.css` (final append), `css/tokens.css` (remove legacy aliases)
- Delete: `css/legacy.css`

**Interfaces:**
- Consumes: `.wrap`, `.label`, `.vf`, `.page-lede` (Tasks 2–4).
- Produces: `.about-header`, `.about-subtitle`, `.about-section`, `.intro-section`, `.intro-image`, `.personality-section`, `.spec-sheet` (`dl`) with `.spec-row`, `.spec-list`, `.contact-links`, `.contact-link`. `main.css` no longer has the `@@next-section` marker.

- [ ] **Step 1: Transform `about.html`**

```bash
python3 - <<'EOF'
import pathlib, re, html

path = pathlib.Path('about.html')
text = path.read_text()

def replace_once(old, new):
    global text
    assert text.count(old) == 1, old[:60]
    text = text.replace(old, new)

# wrappers: two divs -> one .wrap
replace_once('    <div class="about-container">\n      <div class="about-content">\n', '    <div class="wrap about-content">\n')
replace_once('        </div>\n      </div>\n    </div>\n  </main>', '        </div>\n    </div>\n  </main>')

# header
replace_once('''        <div class="about-header">
          <h1>Hello, I'm Andrea!</h1>
          <div class="about-subtitle">
            Nice to meet you, and thank you for being interested in who I am.
          </div>
        </div>''', '''        <header class="about-header">
          <p class="label label--accent">About</p>
          <h1>Hello, I'm Andrea!</h1>
          <p class="about-subtitle">
            Nice to meet you, and thank you for being interested in who I am.
          </p>
        </header>''')

# portrait in a viewfinder frame
replace_once('<div class="intro-image">', '<figure class="intro-image vf">')
replace_once('''                  class="profile-image"
                />
              </div>''', '''                  class="profile-image"
                />
              </figure>''')

# skills grid -> spec sheet (content preserved by parsing the existing markup)
grid = re.search(r'\n( *)<div class="skills-grid">.*?\n\1</div>\n', text, re.S)
assert grid, 'skills-grid not found'
rows = re.findall(r'<h3>(.*?)</h3>\s*<ul>(.*?)</ul>', grid.group(0), re.S)
assert len(rows) == 10, len(rows)
spec = ['\n            <dl class="spec-sheet">']
for name, items in rows:
    lis = ''.join('<li>%s</li>' % li.strip() for li in re.findall(r'<li>(.*?)</li>', items, re.S))
    spec.append('              <div class="spec-row"><dt>%s</dt><dd><ul class="spec-list">%s</ul></dd></div>' % (name.strip(), lis))
spec.append('            </dl>\n')
text = text.replace(grid.group(0), '\n'.join(spec))

# contact links: drop the emoji
replace_once('<span>📧 Email</span>', '<span>Email</span>')
replace_once('<span>🐙 GitHub</span>', '<span>GitHub</span>')
replace_once('<span>💼 LinkedIn</span>', '<span>LinkedIn</span>')

# page no longer needs legacy CSS
replace_once('  <link rel="stylesheet" href="./css/legacy.css" />\n', '')
replace_once('<body class="legacy-layout">', '<body>')

assert 'skills-grid' not in text and 'spec-sheet' in text
assert text.count('<div') == text.count('</div>'), (text.count('<div'), text.count('</div>'))
path.write_text(text)
print('about.html updated; spec rows:', len(rows))
EOF
```
Expected: `about.html updated; spec rows: 10`.

- [ ] **Step 2: Append the About CSS and drop the marker**

Replace the marker line `/* @@next-section — the About section is appended below this marker by Task 5 */` with:

```css
/* -------------------------------------------------------------
   10. About
   ------------------------------------------------------------- */
.about-header {
    padding: var(--space-3xl) 0 var(--space-2xl);
}

.about-header h1 {
    margin: var(--space-md) 0 var(--space-lg);
    font-size: var(--font-size-display);
    line-height: var(--line-height-display);
    letter-spacing: -0.035em;
}

.about-subtitle {
    max-width: 40ch;
    font-size: 1.25rem;
    color: var(--text-secondary);
}

.about-section {
    padding: var(--space-2xl) 0;
    border-top: 1px solid var(--border);
}

.about-section:first-child {
    border-top: 0;
    padding-top: 0;
}

.about-section h2 {
    margin-bottom: var(--space-lg);
}

.intro-section {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 18rem;
    gap: var(--space-2xl);
    align-items: start;
    margin-bottom: var(--space-2xl);
}

.intro-text {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
}

.intro-text p,
.personality-section p {
    margin: 0;
}

.intro-image {
    --vf-inset: 0.75rem;
    position: sticky;
    top: calc(var(--header-height) + var(--space-xl));
    margin: 0;
}

.profile-image {
    width: 100%;
    height: auto;
}

.personality-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    padding: var(--space-lg) 0 var(--space-lg) var(--space-lg);
    border-left: 3px solid var(--accent);
}

.personality-section strong {
    color: var(--accent);
    font-weight: 600;
}

.inline-link {
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
}

/* Spec sheet: key/value rows */
.spec-sheet {
    margin: var(--space-xl) 0 0;
    border-top: 1px solid var(--border-strong);
}

.spec-row {
    display: grid;
    grid-template-columns: 14rem minmax(0, 1fr);
    gap: var(--space-md);
    padding: var(--space-md) 0;
    border-bottom: 1px solid var(--border);
}

.spec-row dt {
    font-family: var(--font-mono);
    font-size: var(--font-size-label);
    font-weight: 600;
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    color: var(--accent);
}

.spec-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs) 0;
    padding: 0;
    margin: 0;
    list-style: none;
}

.spec-list li {
    margin: 0;
    color: var(--text-secondary);
}

.spec-list li + li::before {
    content: "·";
    margin: 0 var(--space-sm);
    color: var(--text-muted);
}

.about-section blockquote {
    max-width: 36ch;
    margin: var(--space-xl) 0;
    padding: 0 0 0 var(--space-lg);
    font-family: var(--font-heading);
    font-size: var(--font-size-h3);
    font-style: normal;
    line-height: 1.3;
    color: var(--text-primary);
}

.contact-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
    margin-top: var(--space-xl);
}

.contact-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 9rem;
    min-height: 2.75rem;
    padding: var(--space-md) var(--space-lg);
    border: 1px solid var(--border-strong);
    font-family: var(--font-mono);
    font-size: var(--font-size-label);
    font-weight: 600;
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    color: var(--text-primary);
    transition:
        color var(--transition-fast),
        border-color var(--transition-fast);
}

.contact-link:hover {
    color: var(--accent);
    border-color: var(--accent);
    text-decoration: none;
}

@media (max-width: 767px) {
    .about-header {
        padding-top: var(--space-2xl);
    }

    .intro-section {
        grid-template-columns: 1fr;
        gap: var(--space-xl);
    }

    .intro-image {
        position: static;
        order: -1;
        max-width: 14rem;
    }

    .spec-row {
        grid-template-columns: 1fr;
        gap: var(--space-xs);
    }

    .contact-link {
        flex: 1 1 8rem;
    }
}
```

- [ ] **Step 3: Delete the legacy stylesheet and aliases**

```bash
git rm -q css/legacy.css
grep -rn "legacy" index.html articles.html article.html about.html css || echo "NO_LEGACY_REFS_IN_PAGES"
```
Expected: `NO_LEGACY_REFS_IN_PAGES` except possibly the alias comment in `css/tokens.css`.

Then in `css/tokens.css` delete the whole block from the comment `/* LEGACY ALIASES — only for css/legacy.css; removed in Task 5 */` banner (three comment lines) through the closing `}` of that last `:root` block, so the file ends after the `[data-theme="light"]` block.

- [ ] **Step 4: Audit the CSS and markup**

Run:

```bash
python3 - <<'EOF'
import re, pathlib
css = pathlib.Path('css/main.css').read_text() + pathlib.Path('css/tokens.css').read_text()
defined = set(re.findall(r'(--[a-z0-9-]+)\s*:', css))
used = set(re.findall(r'var\((--[a-z0-9-]+)', css))
print('undefined tokens:', sorted(used - defined) or 'none')
print('braces', css.count('{'), css.count('}'))
EOF
grep -n "!important" css/main.css css/tokens.css
grep -rn "fonts.googleapis\|fonts.gstatic" *.html css src || echo "NO_GOOGLE_FONTS"
npm run compile && npm run check:contrast | tail -2
```
Expected: `undefined tokens: none` (the viewfinder custom properties `--vf-*` are defined in tokens.css); equal braces; `!important` appears only in the `@media print` block of `main.css`; `NO_GOOGLE_FONTS`; compile clean; `All contrast checks passed`.

- [ ] **Step 5: Verify the About page and all pages once more**

Browser, dark and light, at desktop/tablet/mobile: `http://localhost:3000/about.html` plus a quick pass over `index.html`, `articles.html`, `article.html#operators-a-comprehensive-technical-guide`.
Expected: giant "Hello, I'm Andrea!" headline with an "About" label; portrait inside orange viewfinder corners (sticky on desktop, above the text on mobile); personality paragraphs with an orange left rule and orange bold lead-ins; "What I Do" renders as a spec sheet of 10 mono key rows with dot-separated values; the pull quote in the display font; three contact buttons without emoji that turn orange on hover; no horizontal scroll at 375 px; no console errors on any page.

- [ ] **Step 6: Commit**

```bash
git add about.html css/main.css css/tokens.css
git commit -m "style: darkroom About page; remove legacy stylesheet and aliases

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Motion layer

**Files:**
- Create: `css/motion.css`
- Modify: `src/ts/theme.ts`, the four HTML pages (add the stylesheet link)

**Interfaces:**
- Consumes: `.header`, `.vf-hover`, `.theme-toggle`, `.read-progress`, `.reveal` (already in the markup), `--ease-snap`.
- Produces: html class `theme-vt` (set only while the iris transition runs) and CSS variables `--iris-x`, `--iris-y` set by `theme.ts`.

- [ ] **Step 1: Write `css/motion.css`**

```css
/* =============================================================
   ByteShutter — Motion ("Darkroom")
   Everything here is progressive enhancement: delete this file and
   the site still works. Animate transform, opacity and clip-path only.
   ============================================================= */

@media (prefers-reduced-motion: no-preference) {
    html {
        scroll-behavior: smooth;
    }

    /* Cross-document page transitions: header stays put, content crossfades */
    @view-transition {
        navigation: auto;
    }

    .header {
        view-transition-name: site-header;
    }

    ::view-transition-old(root),
    ::view-transition-new(root) {
        animation-duration: 200ms;
    }

    /* Viewfinder brackets snap in */
    .vf-hover::after {
        transition:
            opacity 120ms ease-out,
            transform 180ms var(--ease-snap);
    }

    /* Aperture toggle turns when the theme changes */
    .theme-toggle svg {
        transition: transform 450ms var(--ease-snap);
    }

    /* Aperture iris reveal for the theme switch (class added by theme.ts) */
    .theme-vt body {
        transition: none;
    }

    .theme-vt::view-transition-old(root),
    .theme-vt::view-transition-new(root) {
        animation: none;
        mix-blend-mode: normal;
    }

    .theme-vt::view-transition-new(root) {
        animation: iris-open 520ms var(--ease-snap) both;
    }
}

@keyframes iris-open {
    from {
        clip-path: circle(0 at var(--iris-x, 50%) var(--iris-y, 50%));
    }

    to {
        clip-path: circle(150vmax at var(--iris-x, 50%) var(--iris-y, 50%));
    }
}

/* Scroll-driven: reading progress and section reveals */
@supports (animation-timeline: scroll()) {
    @media (prefers-reduced-motion: no-preference) {
        .read-progress {
            display: block;
            transform: scaleX(0);
            animation: read-progress linear both;
            animation-timeline: scroll(root block);
        }

        .reveal {
            animation: reveal linear both;
            animation-timeline: view();
            animation-range: entry 0% entry 30%;
        }
    }
}

@keyframes read-progress {
    to {
        transform: scaleX(1);
    }
}

@keyframes reveal {
    from {
        opacity: 0;
        transform: translateY(1.5rem);
    }

    to {
        opacity: 1;
        transform: none;
    }
}
```

- [ ] **Step 2: Link it from every page**

```bash
python3 - <<'EOF'
import pathlib
for name in ['index.html', 'articles.html', 'article.html', 'about.html']:
    path = pathlib.Path(name)
    text = path.read_text()
    old = '  <link rel="stylesheet" href="./css/main.css" />\n'
    assert text.count(old) == 1, name
    text = text.replace(old, old + '  <link rel="stylesheet" href="./css/motion.css" />\n')
    path.write_text(text)
    print('linked motion.css in', name)
EOF
```
Expected: four `linked motion.css in …` lines.

- [ ] **Step 3: Add the iris switch to `src/ts/theme.ts`**

After the `applyTheme` function, add:

```ts
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
```

and change the click handler body from `applyTheme(current === 'dark' ? 'light' : 'dark');` to `switchTheme(current === 'dark' ? 'light' : 'dark', btn);`.

- [ ] **Step 4: Compile and test the behaviour**

Run: `npm run compile && echo COMPILE_OK && python3 -c "t=open('css/motion.css').read();print('braces', t.count('{'), t.count('}'))"`
Expected: `COMPILE_OK`, equal braces.

Browser (desktop), open `http://localhost:3000/index.html` and run with the javascript tool:

```js
const before = document.documentElement.getAttribute('data-theme');
document.getElementById('theme-toggle').click();
await new Promise(r => setTimeout(r, 900));
({ before, after: document.documentElement.getAttribute('data-theme'), stuckClass: document.documentElement.classList.contains('theme-vt'), stored: localStorage.getItem('theme') })
```
Expected: `after` differs from `before`, `stuckClass: false`, `stored` equals `after`. Visually: clicking the aperture reveals the new theme in a circle expanding from the button. Open an article page and scroll: a thin orange line under the header grows with scroll. On the home page the sections below the fold fade/slide in as they enter. Navigating between pages crossfades while the header stays put (Chromium). Hovering a frame row snaps the brackets in. Then emulate reduced motion if available (or in DevTools settings) and confirm no iris, no reveals and no progress line; theme still switches instantly.

- [ ] **Step 5: Commit**

```bash
git add css/motion.css src/ts/theme.ts index.html articles.html article.html about.html
git commit -m "style: add motion layer (view transitions, scroll-driven reveals, iris toggle)

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Docs, agent config, memory and final verification

**Files:**
- Modify: `.claude/skills/byteshutter-consistency/SKILL.md`, `CLAUDE.MD`, `AGENTS.md`, `rules/blog_style_guidelines.md`, `README.md`, `docs/superpowers/specs/2026-10-03-darkroom-restyle-design.md`
- Memory: `/Users/andrea/.claude/projects/-Users-andrea-Documents-Sites-byteshutter/memory/` (`project_editorial_restyle.md` → Darkroom, `MEMORY.md`)

**Interfaces:**
- Consumes: the finished system from Tasks 1–6.

- [ ] **Step 1: Rewrite the design-system skill**

Replace `.claude/skills/byteshutter-consistency/SKILL.md` with:

````markdown
---
name: byteshutter-consistency
description: ByteShutter-specific design system rules: the "Darkroom" aesthetic (camera + code), design tokens, typography, viewfinder motif, motion, dark/light themes, breakpoints, and what NOT to do. Invoke before adding or modifying any HTML/CSS in this project.
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

Colours (dark / light): `--bg-primary` `#14110f`/`#f3ecdc`, `--bg-secondary`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent` `#ff6b1f`/`#b03a0a`, `--accent-contrast`, `--border` (decorative), `--border-strong` (outlines of interactive components, >= 3:1), `--film`.
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
````

- [ ] **Step 2: Update `CLAUDE.MD`, then sync `AGENTS.md`**

Make these edits in `CLAUDE.MD` (read the file first; match the existing wording):
- In **Project Structure**, add `├── fonts/             # Self-hosted woff2 fonts + licences` under `images/`, and note `css/` holds `tokens.css`, `main.css`, `motion.css`.
- In **Build Process**, step 3 list: add `fonts/` to the copied items.
- In **Code Conventions → Gitignored generated files**: `js/theme.js, js/articles.js, js/article.js, js/home.js, js/feed.js, data/, dist/`.
- In **Code Conventions → Guidelines**: point to the `byteshutter-consistency` skill and `rules/blog_style_guidelines.md` for the "Darkroom" design (dark-first, ink/paper/orange, viewfinder motif).
- Add under **Notes for Claude**: `- Design is "Darkroom" (see .claude/skills/byteshutter-consistency); never reintroduce third-party font/CDN requests; run npm run check:contrast after palette changes`.

Then sync: `cp CLAUDE.MD AGENTS.md && cmp CLAUDE.MD AGENTS.md && echo IDENTICAL`
Expected: `IDENTICAL`.

- [ ] **Step 3: Rewrite `rules/blog_style_guidelines.md` and touch the README**

Replace `rules/blog_style_guidelines.md` with a concise Darkroom guide:

```markdown
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
```

In `README.md`, in the **Features** list add: `- **Self-hosted fonts**: no third-party requests; the site keeps its "no tracking" promise`.

- [ ] **Step 4: Record deviations in the spec**

Append to `docs/superpowers/specs/2026-10-03-darkroom-restyle-design.md`:

```markdown
## 11. Implementation notes (deviations from the draft)

- **Hero layout:** the hero illustration is a 2.46:1 panorama, so the hero is a stacked composition (label, headline, note, then the full-width illustration) instead of two columns; two columns would have cropped the artwork.
- **Shared TypeScript module:** `src/ts/feed.ts` (feed fetch, frame numbers, date format, row markup, HTML escaping) is shared by `home.ts`, `articles.ts` and `article.ts`.
- **Books:** each recently-read book keeps its full description inside a native `<details>` ("About the book") so the row stays compact without losing copy.
- **About:** the "What I Do" skill cards became a semantic `<dl>` spec sheet; the emoji on the three contact links were removed to match the mono labels.
- **Light accent contrast:** verified with `npm run check:contrast`.
- **Temporary `css/legacy.css`:** existed only while pages were converted; deleted in Task 5.
- **Not changed:** `images/highlighted/hero_image.jpg` is a 5.2 MB PNG saved with a `.jpg` extension; optimising it is recommended but out of scope here.
```

- [ ] **Step 5: Update memory**

Replace the content of `/Users/andrea/.claude/projects/-Users-andrea-Documents-Sites-byteshutter/memory/project_editorial_restyle.md` with a note named `darkroom_restyle` (type `project`) stating: the Semafor editorial look was superseded on 2026-10-03 by the dark-first "Darkroom" restyle (camera + code identity; ink/paper/orange `#ff6b1f`; Bricolage Grotesque + Lora + JetBrains Mono self-hosted; viewfinder motif, frame numbers; tokens/main/motion CSS; spec and plan under `docs/superpowers/`; user rule: plain HTML/CSS/TS, no framework). Rename the file to `project_darkroom_restyle.md` and update the `MEMORY.md` line to `- [Darkroom restyle](project_darkroom_restyle.md) — dark-first camera+code redesign replacing Semafor look (2026-10-03)`.

- [ ] **Step 6: Final verification matrix**

Run:

```bash
npm run compile && npm run check:contrast | tail -1 && npm run build 2>&1 | tail -2 && ls dist dist/fonts | head -20
grep -rn "legacy\|Libre\|Bodoni\|fonts.googleapis" index.html articles.html article.html about.html css src || echo "CLEAN"
git status --short
```
Expected: compile OK; `All contrast checks passed`; build OK with `fonts` and `css/{tokens,main,motion}.css` in `dist`; `CLEAN`; git status lists only the intended doc/memory-adjacent files (memory lives outside the repo).

Browser matrix — for each of `index.html`, `articles.html`, `article.html#operators-a-comprehensive-technical-guide`, `about.html`, at 375 / 768 / 1024 px, in dark and light: no horizontal scroll, headings in order, keyboard Tab shows a visible focus ring on every interactive element and the skip link works, console clean, fonts served from `./fonts/` only (`read_network_requests` shows no third-party host).

- [ ] **Step 7: Commit and stop the dev server**

```bash
git add .claude/skills/byteshutter-consistency/SKILL.md CLAUDE.MD AGENTS.md rules/blog_style_guidelines.md README.md docs/superpowers/specs/2026-10-03-darkroom-restyle-design.md
git commit -m "docs: document the Darkroom design system and retire the Semafor rules

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
pkill -f "http.server 3000"; echo stopped
```

---

## Self-review (spec coverage)

| Spec requirement | Task |
|---|---|
| §4.1 palette + contrast | 1 (tokens, `check:contrast`), 5 and 7 (re-run) |
| §4.2 self-hosted fonts, preload, no Google Fonts | 1 (files, `@font-face`, build copy), 2 (head links), 5/7 (grep) |
| §4.3 viewfinder, frame numbers, film strip, aperture toggle, grain | 2 (`.vf`, grain, aperture), 3 (frame rows, film strip), 4 (frame label on article) |
| §4.4 calm article page | 2 (`body.page-article` grain off), 4 (quiet column) |
| §5.1 home (hero, latest, photo, books, links, about) | 3 |
| §5.2 articles list | 3 (`.frame-row`), 4 (page head, skeleton, empty/error) |
| §5.3 article page (frame, meta, code label, figures) | 4 |
| §5.4 About (portrait frame, spec sheet) | 5 |
| §5.5 nav/footer | 2 |
| §6 motion (view transitions, scroll-driven, iris, snap, reduced-motion) | 6 (+ base hover states in 2) |
| §7 structure (3 CSS files, fonts in build, TS files, `.gitignore`) | 1, 2, 3, 6 |
| §8 rollout order and docs/skill/memory | 7 (steps 1–5) |
| §9 verification | per-task verify steps and Task 7 step 6 |
| User instruction: no framework | Global Constraints; nothing in the plan adds a dependency |

Type consistency: `renderFrameRow(article, number, headingLevel)` is defined in Task 3 and called with `3` (home) and `2` (list); `frameNumbers`, `frameLabel`, `formatShortDate`, `escapeHtml`, `fetchArticleFeed` keep the same names in Tasks 3 and 4; CSS classes created in Task 2 (`.wrap`, `.label`, `.vf`, `.vf-hover`, `.read-progress`) are used with the same names in Tasks 3–6; `.theme-vt`, `--iris-x/y` match between `theme.ts` and `motion.css`.
