# ByteShutter - Project Context for Claude

## Project Overview

ByteShutter is a modern, responsive blog and personal website built with vanilla HTML, CSS, and TypeScript (no framework, no bundler). The site features articles about web development, iOS development, Swift, SwiftUI, and responsive design principles, alongside sections for photography, books, and personal information.

## Tech Stack

- **Language**: TypeScript 6.x (compiled with `tsc`)
- **Runtime**: Vanilla HTML/CSS — no framework, no bundler
- **Markdown converter**: `tsx` + `gray-matter` (Node.js script)
- **Article rendering**: `marked.js` v15+ (loaded from `js/vendor/`)
- **Build**: Custom shell script in `npm run build` (compiles TS → converts articles → copies to `dist/`)
- **Deployment**: GitHub Actions → GitHub Pages

## Project Structure

```
byteshutter/
├── articles/          # Markdown source files for blog posts
├── src/ts/            # TypeScript source files (compiled to js/)
├── scripts/           # Build scripts
│   └── ConvertArticlesToJSON/  # Markdown to JSON conversion
├── css/               # Static stylesheets
├── js/                # Compiled JS output + vendor scripts (js/vendor/)
├── images/            # Static image assets
├── data/              # Generated JSON articles (gitignored, created at build time)
├── *.html             # HTML pages (index, articles, article, about)
└── dist/              # Production build output (gitignored, created at build time)
```

## Key Features

1. **Markdown-Powered Articles**: Blog posts are written in Markdown with frontmatter metadata and converted to JSON during build
2. **Responsive Design**: Fully responsive layout for desktop and mobile
3. **Theme Support**: Dark/Light theme switching (persisted in localStorage)
4. **Multi-Page Navigation**: Separate HTML pages with relative path links
5. **Type-Safe**: Full TypeScript implementation
6. **Personal Sections**: Books (currently reading/recently read), photography showcase, about section

## Development Workflow

### Running Locally

```bash
npm run dev          # Compile TS + convert articles + serve on http://localhost:3000
npm run build        # Compile TS + convert articles + assemble dist/
npm run compile      # Manually compile TypeScript only
npm run convert      # Manually convert markdown articles to JSON
```

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
3. **Conversion**: `scripts/ConvertArticlesToJSON/convertArticlesToJson.ts` processes markdown files
4. **Output**: JSON files in `data/` directory — `data/articles.json` (feed) + one file per article
5. **Routing**: Article pages use hash routing — `article.html#slug` loads `data/slug.json`

### Build Process

The build process (`npm run build`) automatically:
1. Compiles `src/ts/*.ts` → `js/*.js` via `tsc -p tsconfig.browser.json`
2. Converts all markdown articles → `data/*.json` via the conversion script
3. Copies all files to `dist/`: HTML pages, `css/`, `js/`, `images/`, `data/`, `favicon.svg`, `.nojekyll`

## Code Conventions

- **TypeScript files**: `src/ts/*.ts` — compiled to `js/*.ts`, strict mode enabled
- **Gitignored generated files**: `js/theme.js`, `js/articles.js`, `js/article.js`, `data/`, `dist/`
- **Vendor scripts**: `js/vendor/` — tracked in git (e.g. `marked.min.js`)
- **File Extensions**: `.ts` for all TypeScript, `.html` for pages

## Important Context

- This is a personal blog/portfolio website
- Content includes technical articles, book reviews, and photography
- Articles use GitHub Flavored Markdown (GFM) rendered client-side by `marked.js`
- All HTML uses relative paths (`./css/`, `./js/`, `./data/`) — works at any GitHub Pages subpath
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

## Notes for Claude

- Always read existing files before modifying them
- Maintain TypeScript strictness (`tsconfig.browser.json` has `strict: true`)
- There is no framework — DOM manipulation is done directly in TypeScript
- Run the markdown converter when working with articles
- Test changes with `npm run dev` before building
- This is a personal project, so changes should align with the existing personal/portfolio nature
