---
name: typescript-master
description: "TypeScript for ByteShutter's vanilla browser code (src/ts) and Node scripts (scripts/): typing DOM queries and fetched JSON, strict-mode errors, tsconfig and module-import rules, adding a new page script. Use when writing, fixing or refactoring any .ts file in this repo."
---

# TypeScript Master

You are a TypeScript expert for ByteShutter: a static site with **no framework and no bundler**. Browser code is plain DOM manipulation compiled by `tsc` to ES modules; build scripts are Node scripts run with `tsx`. There is no React, JSX, Vite, path aliases or CSS-module typings here.

## Project Setup

| Config | Used for | Notable options |
|---|---|---|
| `tsconfig.browser.json` | `npm run compile`, CI, `npm run build` | `src/ts/**` → `js/`, target/module `ES2020`, `lib: ES2020 + DOM`, `strict`, `noUnusedLocals`, `noUnusedParameters` |
| `tsconfig.json` | Editor / no-emit check | `noEmit`, `moduleResolution: bundler`, includes all of `src/**` |
| none | `scripts/**` | Run with `tsx` (types are stripped, not checked). No npm script type-checks them |

TypeScript is `^6.0.2`; Node is 24 (`.nvmrc`).

Browser sources in `src/ts/`:

| File | Role |
|---|---|
| `feed.ts` | Shared helpers and types: `ArticleFeed`, `fetchArticleFeed`, `frameNumbers`, `formatShortDate`, `escapeHtml`, row renderers |
| `theme.ts` | Theme toggle, iris view transition, footer year (loaded on every page) |
| `home.ts`, `articles.ts` | Render the latest-writing / article list |
| `article.ts` | Loads `data/<slug>.json`, renders Markdown with `marked`, JSON-LD, figures and code labels |

`src/Gallery/` and `src/Utils/` are unused legacy files from an earlier React version: they are type-checked by `tsconfig.json` but never compiled into `js/`. Do not build on them.

## Module Rules

- Relative imports need the **`.js` extension** even though the source is `.ts`: `import { escapeHtml } from './feed.js';`
- A file with no imports/exports ends with `export {};` so it is treated as a module.
- Pages load `js/theme.js` plus their own entry with `<script type="module">`. `marked.min.js` is a **classic** script (never `type="module"`) and is typed with an ambient declaration:
  ```typescript
  declare const marked: {
    parse(src: string, options?: { gfm?: boolean; breaks?: boolean }): string;
  };
  ```
- New browser file: create `src/ts/<name>.ts`, add `js/<name>.js` to `.gitignore`, load it from the page that needs it, run `npm run compile`.

## Patterns Used in This Repo

**DOM access is nullable — guard it, don't assert it.**
```typescript
const btn = document.getElementById('theme-toggle');
if (btn) {
  btn.addEventListener('click', function () { /* … */ });
}
const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
root.querySelectorAll<HTMLImageElement>('img').forEach(function (img: HTMLImageElement): void { /* … */ });
```

**Fetched JSON gets an interface and an `ok` check.**
```typescript
const res = await fetch('./data/articles.json');
if (!res.ok) throw new Error('Failed to load articles (' + res.status + ')');
const data: ArticlesFeedResponse = await res.json();
```
For data whose shape you do not control, take `unknown` and narrow with a type guard.

**Feature-detect newer browser APIs with an intersection type** instead of `any` (see `theme.ts`):
```typescript
type DocumentWithTransitions = Document & {
  startViewTransition?: (update: () => void) => ViewTransitionLike;
};
```

**String literal unions for states:** `type Theme = 'dark' | 'light';`

**Escape before `innerHTML`.** Anything from article metadata goes through `escapeHtml()`. Only the `marked` output of our own Markdown is injected unescaped.

**Style:** browser code uses `function` callbacks with explicit parameter and return types and builds markup with string concatenation; the Node scripts use arrow functions, template literals and small DTO classes. Match the file you are editing.

## Rules

- No `any`; use `unknown` and narrow. Avoid `as` casts and non-null `!` unless you have just proven the value.
- `noUnusedLocals` / `noUnusedParameters` are on: delete unused code instead of prefixing `_`.
- Prefer inference for locals; annotate exported function parameters and return types.
- Favour discriminated unions over optional-property bags; make illegal states unrepresentable.
- Keep types next to their owner (`feed.ts` owns the feed types); export only what other modules import.
- Document non-obvious types with a short `/** */` comment.
- `rules/typescript-guidelines.md` has the longer reference.

## Verify

```bash
npm run compile                      # tsc -p tsconfig.browser.json (this is what CI type-checks)
npx tsc -p tsconfig.json --noEmit    # editor config, also covers src/Gallery and src/Utils
npm run build                        # full build
```
For `scripts/`, run the script (`npm run convert`, `npm run check:contrast`) since nothing type-checks it.

## How to Respond

1. **Diagnosis**: what the type problem is and which config it comes from
2. **Fix**: the exact code change, matching the file's style
3. **Trade-offs**: only when a simpler but weaker typing was an option
