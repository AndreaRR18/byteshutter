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

---

## Editorial Line & Content Guidelines

This section defines the identity, voice, and standards of ByteShutter's articles. Use it every time you help write, review, outline, or improve a blog post for this site.

### Author Identity

**Name:** Andrea Rinaldi
**Role:** Senior iOS developer (primary), with web development background
**Location:** Italy
**Main languages:** Swift, Kotlin
**Primary stack:** SwiftUI, UIKit, Jetpack Compose
**Philosophy:** Pragmatic engineering, clean design, lifelong learning, storytelling as a craft

Andrea is a software engineer with deep mobile expertise. He values the open-source and learning community, reads technical books seriously (The Pragmatic Programmer, A Philosophy of Software Design), and is interested in how AI and LLMs are changing software abstraction. He also has a creative side — documentary photography — which informs how he approaches narrative and structure.

---

### Target Audience

Articles are written for **intermediate-to-senior developers** who already know how to code and want to go deeper. Do not over-explain basic syntax. Do not assume familiarity with niche or internal tooling unless the article is explicitly about it.

Assume the reader:
- Writes Swift or another modern language professionally
- Is comfortable with type systems, optionals, generics, async/await
- Reads official documentation and wants to understand *why*, not just *how*

---

### Article Language

All articles are written in **English**. The English is precise, formal, and idiomatic — academic but not dry. Avoid filler phrases. Avoid colloquialisms in article body text (casual tone is reserved for the homepage and About page, not for articles).

---

### Tone & Voice

| Context | Tone |
|---|---|
| Articles | Formal, authoritative, educational, clear |
| Homepage / About | Warm, personal, self-deprecating, casual |
| Code comments | Concise, practical |

For articles specifically:
- **Authoritative but not arrogant** — explain things as if teaching a talented colleague, not lecturing a student
- **Precise** — use exact terminology; never say "stuff" or "things" in a technical context
- **Bridge theory and practice** — ground abstract concepts in concrete Swift examples
- **No fluff** — every sentence should earn its place; avoid preambles like "In this article, we will..."
- **Comparative when useful** — when a concept applies across languages (Swift, Kotlin, Haskell, etc.), comparing implementations deepens the reader's understanding

---

### Content Pillars

Articles on ByteShutter fall into these categories:

1. **Swift & iOS Development** *(primary)* — deep dives into Swift language features, iOS frameworks (SwiftUI, UIKit), architecture patterns, state management (Flow library), operators, generics, concurrency, etc.
2. **Programming Fundamentals** — language-agnostic concepts (operators, type systems, abstraction, design principles) with Swift as the main implementation lens
3. **Software Design & Architecture** — patterns, clean code, pragmatic approaches to building maintainable systems
4. **Tooling & Workflow** — Xcode, CI/CD, GitHub Actions, SPM, build pipelines

Topics to **avoid** in articles (they belong on the homepage, not in posts):
- Book summaries or reviews (those go in the homepage "books" section)
- Photography commentary
- Pure opinion pieces without technical substance

---

### Article Structure

Every article should follow this structure:

```
1. Title (clear, specific — not clickbait)
2. Excerpt / intro paragraph (2–4 sentences, factual hook, states what the reader will learn)
3. Conceptual foundation (definitions, context, why this matters)
4. Core content (organized with H2/H3 headings, progressing from simple to complex)
5. Code examples (inline for snippets, fenced blocks with language tag for longer examples)
6. Advanced considerations or edge cases
7. Conclusion / summary (brief, actionable takeaway — no padding)
8. References (official docs, relevant papers or articles)
```

Articles **may be part of a series**. If so, note the series and link to related parts in the intro.

---

### Code Examples

- **Language:** Swift is the default. Use other languages (Kotlin, Python, Haskell) only when making cross-language comparisons
- **Format:** Always use fenced Markdown code blocks with language identifier (` ```swift `)
- **Quality:** All code must be syntactically correct and reflect current Swift/iOS best practices. Do not use deprecated APIs. Do not use pseudocode without clearly labeling it as such
- **Comments:** Add inline comments to explain non-obvious lines; do not over-comment obvious code
- **Length:** Prefer focused, minimal examples that demonstrate one concept at a time

---

### Publication Model

ByteShutter publishes **slowly and deliberately** — depth over frequency. A single article can take weeks to get right. This means:

- Never sacrifice accuracy for speed
- Each article should be comprehensive enough to stand on its own as a reference
- Quality bar: comparable to a well-edited engineering blog (e.g., Swift by Sundell, objc.io, NSHipster)

---

### Available Skills for Article Work

When working on articles for this blog, always use the available Claude skills:

- **`tech-article-reviewer`** — use this to review, improve, or proofread any draft article. It evaluates technical accuracy, clarity, style, and structure with severity-rated feedback and produces a revised version
- **`idea-brainstorm`** — use this when exploring potential new article topics, validating ideas, or stress-testing an outline before committing to writing it

---

### Frontmatter Template

When creating a new article file in `articles/`:

```markdown
---
title: "Article Title"
excerpt: "One or two sentences that accurately describe what the reader will learn. No hype."
created_at: YYYY-MM-DD
tags: ["swift", "ios", "relevant-tag"]
---
```

**Tags conventions:**
- Use lowercase, hyphen-separated slugs
- Always include the primary language or platform (`swift`, `ios`, `typescript`, `web`)
- Add topic tags as needed (`state-management`, `operators`, `concurrency`, `swiftui`, `architecture`)
