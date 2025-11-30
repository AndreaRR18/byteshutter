# ByteShutter - Project Context for Claude

## Project Overview

ByteShutter is a modern, responsive blog and personal website built with React, TypeScript, and Vite. The site features articles about web development, iOS development, Swift, SwiftUI, and responsive design principles, alongside sections for photography, books, and personal information.

## Tech Stack

- **Framework**: React 19.2.0
- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 7.2.4
- **Router**: React Router DOM 7.9.6
- **Markdown**: react-markdown with remark-gfm
- **Testing**: Vitest 3.1.4 with @testing-library/react
- **Linting**: ESLint 9.25.0 with TypeScript ESLint

## Project Structure

```
byteshutter/
├── articles/          # Markdown source files for blog posts
├── src/              # React application source code
│   ├── Landing/      # Landing page components (Hero, About, Books, Photos, Articles)
│   ├── Footer/       # Footer component
│   └── ...           # Other components
├── scripts/          # Build scripts
│   └── ConvertArticlesToJSON/  # Markdown to JSON conversion
├── public/           # Static assets and generated JSON data
└── dist/             # Production build output (generated)
```

## Key Features

1. **Markdown-Powered Articles**: Blog posts are written in Markdown with frontmatter metadata and converted to JSON during build
2. **Responsive Design**: Fully responsive layout for desktop and mobile
3. **Theme Support**: Dark/Light theme switching
4. **Client-Side Routing**: Fast navigation with React Router
5. **Type-Safe**: Full TypeScript implementation
6. **Personal Sections**: Books (currently reading/recently read), photography showcase, about section

## Development Workflow

### Running Locally

```bash
npm run dev          # Start development server on http://localhost:5173
npm run build        # Convert articles + build for production
npm run preview      # Convert articles + build + preview production build
npm test            # Run Vitest tests
npm run lint        # Run ESLint
npm run convert     # Manually convert markdown articles to JSON
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
4. **Output**: JSON files in `public/` directory for frontend consumption
5. **DTOs**:
   - `ArticleFeedDTO.ts` - Article list/feed format
   - `ArticleDetailDTO.ts` - Individual article format

### Build Process

The build process automatically:
1. Converts all markdown articles to JSON
2. Builds the React application with Vite
3. Outputs everything to `dist/` for deployment

## Code Conventions

- **Component Structure**: Feature-based organization (Landing/, Footer/, etc.)
- **Index Files**: Barrel exports via index.ts files
- **TypeScript**: Strict typing throughout
- **File Extensions**: `.tsx` for React components, `.ts` for utilities/scripts

## Important Context

- This is a personal blog/portfolio website
- Content includes technical articles, book reviews, and photography
- The landing page consists of multiple sections (Hero, About, Articles, Books, Photos)
- Articles use GitHub Flavored Markdown (GFM) via remark-gfm
- The build script must be run before deployment to convert articles

## Current Git Status

- Working in a git worktree at: `/Users/andrea/.claude-worktrees/byteshutter/pedantic-lichterman`
- Main repository: `/Users/andrea/Documents/Sites/byteshutter`
- Current branch: `pedantic-lichterman`
- Main branch: `main`
- Status: Clean working tree
- Recent commits focus on preview fixes, package updates, favicon, and CI configuration

## Common Tasks

### Adding a New Article
1. Create `.md` file in `articles/` directory
2. Add frontmatter with title, excerpt, created_at, and tags
3. Write content in Markdown
4. Run `npm run convert` to generate JSON
5. Article appears automatically on the website

### Making Component Changes
1. Navigate to appropriate directory in `src/`
2. Edit `.tsx` files
3. TypeScript will catch type errors
4. Test with `npm run dev`
5. Verify with `npm run lint`

### Deployment
1. Ensure all markdown articles are written
2. Run `npm run build` to create production build
3. Deploy contents of `dist/` directory

## Notes for Claude

- Always read existing files before modifying them
- Maintain TypeScript strictness
- Follow existing component structure patterns
- Run the markdown converter when working with articles
- Test changes with `npm run dev` before building
- Respect the existing code organization (index files, feature folders)
- This is a personal project, so changes should align with the existing personal/portfolio nature
