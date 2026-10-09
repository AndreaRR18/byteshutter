# ByteShutter - Project Context for AI Agents

## Project Overview

ByteShutter is a modern, responsive blog and personal website built with vanilla HTML, CSS, and TypeScript (no framework, no bundler). The site features articles about web development, iOS development, Swift, SwiftUI, and responsive design principles, alongside sections for photography, books, and personal information.

## Tech Stack

- **Language**: TypeScript 6.x (compiled with `tsc`), Node 24 (`.nvmrc`)
- **Runtime**: Vanilla HTML/CSS — no framework, no bundler; pages load compiled ES modules via `<script type="module">`
- **Markdown converter**: `tsx` + `gray-matter` (Node.js script)
- **Article rendering**: `marked.js` v15+ (loaded from `js/vendor/`)
- **Build**: Custom shell script in `npm run build` (compiles TS → converts articles → copies to `dist/`)
- **CI/CD**: GitHub Actions (`.github/workflows/`) → GitHub Pages

## Project Structure

```
byteshutter/
├── articles/          # Markdown source files for blog posts
├── src/ts/            # Browser TypeScript (compiled to js/): theme, home, articles, article, feed
├── src/Gallery/       # Legacy React-era helpers — unused, not compiled, don't build on them
├── src/Utils/         #   (same: src/Utils/ImageUtils.ts)
├── scripts/           # Node scripts, run with tsx (not type-checked by tsc)
│   ├── ConvertArticlesToJSON/  # Markdown → JSON (feed + one file per article)
│   └── CheckContrast/          # WCAG contrast check for css/tokens.css
├── css/               # Stylesheets: tokens.css, main.css, motion.css
├── js/                # Compiled JS output (gitignored) + vendor scripts (js/vendor/, tracked)
├── fonts/             # Self-hosted woff2 fonts + licences
├── images/            # Static images: about/, book_cover/, certificates/, highlighted/
├── data/              # Generated JSON articles (gitignored, created at build time)
├── rules/             # Style and code guidelines (blog, typescript)
├── docs/              # Specs and implementation plans (docs/superpowers/{specs,plans})
├── .agents/skills/    # Project skills — the real files (read by Mistral Vibe)
├── .claude/skills     # Symlink to ../.agents/skills (read by Claude Code)
├── .github/workflows/ # ci.yml, deploy.yml, release.yml
├── AGENTS.md          # Project instructions — the single source of truth (this file)
├── CLAUDE.md          # One line, `@AGENTS.md`, so Claude Code loads this file
├── *.html             # HTML pages (index, articles, article, about)
└── dist/              # Production build output (gitignored, created at build time)
```

## Key Features

1. **Markdown-Powered Articles**: Blog posts are written in Markdown with frontmatter metadata and converted to JSON during build
2. **Responsive Design**: Fully responsive layout for desktop and mobile
3. **Theme Support**: Dark/Light theme switching (persisted in localStorage)
4. **Multi-Page Navigation**: Separate HTML pages with relative path links
5. **Type-Safe**: Full TypeScript implementation
6. **Personal Sections**: The home page shows the latest writing (frame-numbered), a highlighted photo, books, interesting articles and a short bio; `about.html` has the longer bio, certificates, philosophy and contact links

## Development Workflow

### Running Locally

```bash
npm run dev            # Compile TS + convert articles + serve on http://localhost:3000 (no watch mode)
npm run build          # Compile TS + convert articles + assemble dist/
npm run compile        # Manually compile TypeScript only
npm run convert        # Manually convert markdown articles to JSON
npm run check:contrast # WCAG contrast check for the colour tokens in css/tokens.css
```

`npm run dev` serves the repo root statically and does not watch. After editing `src/ts/`, re-run `npm run compile` and reload; after editing `articles/`, re-run `npm run convert`.

### Article System

Articles are managed through a markdown-to-JSON pipeline:

1. **Source**: Markdown files in `articles/` directory
2. **Frontmatter Format**:
   ```markdown
   ---
   title: "Article Title"
   excerpt: "Brief description"
   created_at: 2024-01-01
   tags: ["tag1", "tag2"]
   ---

   Article content...
   ```
3. **Conversion**: `scripts/ConvertArticlesToJSON/convertArticlesToJson.ts` validates the frontmatter (`title`, `excerpt`, `created_at` required; `tags` must be an array) and fails the build on errors or duplicate slugs
4. **Output**: JSON files in `data/` directory — `data/articles.json` (feed) + one file per article
5. **Slug**: derived from the title (lowercased, non-alphanumerics → `-`), so renaming a title changes the article URL
6. **Routing**: Article pages use hash routing — `article.html#slug` loads `data/slug.json`
7. **Frame numbers**: `No. 01` is the oldest article by `created_at`; the number is computed client-side in `src/ts/feed.ts`

### Build Process

The build process (`npm run build`) automatically:
1. Compiles `src/ts/*.ts` → `js/*.js` via `tsc -p tsconfig.browser.json`
2. Converts all markdown articles → `data/*.json` via the conversion script
3. Copies an explicit list of files to `dist/`: `index.html`, `articles.html`, `article.html`, `about.html`, `favicon.svg`, `.nojekyll`, `css/`, `js/`, `fonts/`, `images/`, `data/`

A new top-level HTML page or asset directory must be added to the `cp` list in `package.json` or it will not be deployed.

### CI/CD

- `ci.yml` — every push: `npm ci`, `tsc -p tsconfig.browser.json --noEmit`, `npm run convert`, `npm run build` (Node 24). It does not run `check:contrast`
- `deploy.yml` — push to `main` (or manual dispatch): `npm run build`, then publishes `dist/` to GitHub Pages
- `release.yml` — pushing a `v*` tag creates a GitHub Release with generated notes

## Code Conventions

- **TypeScript files**: `src/ts/*.ts` — compiled to `js/*.js`, strict mode enabled (plus `noUnusedLocals` / `noUnusedParameters` in `tsconfig.browser.json`)
- **Two tsconfigs**: `tsconfig.browser.json` emits `src/ts` → `js/`; `tsconfig.json` is a no-emit check over all of `src/`
- **Imports**: relative imports between browser modules need the `.js` extension (`import { x } from './feed.js'`); files without imports/exports end with `export {};`
- **Script loading**: each page loads `js/theme.js`, plus its own module (`home.js`, `articles.js`, `article.js`). `marked.min.js` is a classic script and must stay one (never add `type="module"`) so it runs before the deferred modules
- **New TS file**: add its compiled `js/<name>.js` to `.gitignore` and load it from the page that needs it
- **Gitignored generated files**: `js/theme.js`, `js/articles.js`, `js/article.js`, `js/home.js`, `js/feed.js`, `data/`, `dist/`
- **Vendor scripts**: `js/vendor/` — tracked in git (e.g. `marked.min.js`)
- **File Extensions**: `.ts` for all TypeScript, `.html` for pages
- **Escaping**: anything from article metadata inserted with `innerHTML` goes through `escapeHtml()` from `feed.ts`
- **Design**: "Darkroom" — dark-first, ink/paper/orange, viewfinder motif, frame-numbered articles. See the `byteshutter-consistency` skill (`.agents/skills/`) for tokens and rules
- **Guidelines**: See `rules/typescript-guidelines.md` for TypeScript patterns and `rules/blog_style_guidelines.md` for visual design conventions

## Project Skills

This repo is set up for both Mistral Vibe and Claude Code. The real files live in `.agents/skills/<name>/SKILL.md` (Vibe reads that path); `.claude/skills` is a symlink to it for Claude Code, and `CLAUDE.md` only imports this file. Both agents load a skill when its description matches, and both run one by name with `/<skill-name>`. The index and the rules for writing portable skills are in `.agents/skills/README.md`.

| Skill | Use it when |
|---|---|
| `byteshutter-consistency` | Before adding or changing any HTML/CSS (tokens, viewfinder motif, motion, themes) |
| `css-standards` / `html-standards` | Before writing or reviewing CSS / HTML |
| `blog-article-expert` | Creating or editing articles in `articles/` |
| `typescript-master` | TypeScript design, typing problems, `tsconfig` questions |
| `code-reviewer` | Reviewing a diff or PR in this repo |
| `web-accessibility-seo-expert` | Accessibility or SEO work on pages |
| `open-pr` | Pushing the current branch and opening a GitHub pull request (`/open-pr [title]`) |

Skill rules that keep them portable: `SKILL.md` with valid, quoted YAML frontmatter (`name` equal to the directory name), no `allowed-tools`, no agent-specific tool names in the body. Mistral Vibe loads project skills and `AGENTS.md` only from a trusted folder.

## Important Context

- This is a personal blog/portfolio website
- Content includes technical articles, book reviews, and photography
- Articles use GitHub Flavored Markdown (GFM) rendered client-side by `marked.js`
- All HTML uses relative paths (`./css/`, `./js/`, `./data/`) — works at any GitHub Pages subpath
- The site is served from `https://andrearr18.github.io/byteshutter/`
- The build script must be run before deployment to compile TS and convert articles

## Common Tasks

### Adding a New Article
1. Create `.md` file in `articles/` directory
2. Add frontmatter with title, excerpt, created_at, and tags
3. Write content in Markdown
4. Run `npm run convert` to generate JSON
5. Article appears automatically on the website

### Making TypeScript Changes
1. Edit files in `src/ts/`
2. Run `npm run compile` to check for type errors
3. Test with `npm run dev`

### Deployment
1. Merge branch to `main`
2. GitHub Actions automatically runs `npm run build` and deploys `dist/` to GitHub Pages

## Notes for AI Agents

- Always read existing files before modifying them
- Maintain TypeScript strictness (`tsconfig.browser.json` has `strict: true`)
- There is no framework — DOM manipulation is done directly in TypeScript
- Run the markdown converter when working with articles
- Test changes with `npm run dev` before building
- Never add third-party requests (fonts, CDNs, analytics) — the site promises "no analytics, no tracking"; fonts are self-hosted in `fonts/`
- Run `npm run check:contrast` after changing any colour in `css/tokens.css`
- Never commit generated output (`js/*.js` except `js/vendor/`, `data/`, `dist/`)
- Edit project instructions only in `AGENTS.md`. `CLAUDE.md` must stay a single `@AGENTS.md` line (Claude Code expands the import); never copy content into it
- Edit skills only under `.agents/skills/`. `.claude/skills` is a symlink to it, so never create a second copy
- Keep file names exact: `AGENTS.md`, `CLAUDE.md`, `SKILL.md` (CI and Linux are case-sensitive)
- This is a personal project, so changes should align with the existing personal/portfolio nature
