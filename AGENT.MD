# ByteShutter - Project Context for Claude

## Project Overview

ByteShutter is a modern, responsive blog and personal website built with HTML, CSS, and TypeScript. The site features articles about web development, iOS development, Swift, SwiftUI, and responsive design principles, alongside sections for photography, books, and personal information.

## Tech Stack

- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 7.2.4
- **Markdown**: Custom markdown processor
- **Testing**: Vitest 3.1.4 with JSDOM
- **Linting**: ESLint 9.25.0 with TypeScript ESLint
- **Styling**: Pure CSS with CSS modules
- **No Framework**: Vanilla HTML/CSS/JS implementation

## Project Structure

```
byteshutter/
├── articles/          # Markdown source files for blog posts
├── public_html/       # HTML/CSS/JS application source code
│   ├── assets/        # JavaScript, CSS, and images
│   │   ├── js/        # TypeScript/JavaScript modules
│   │   ├── css/       # CSS styles
│   │   └── images/    # Image assets
│   ├── components/    # HTML components
│   ├── pages/         # HTML pages
│   ├── tests/         # Test suite (Vitest)
│   └── ...           # Other assets
├── scripts/          # Build scripts
│   └── ConvertArticlesToJSON/  # Markdown to JSON conversion
├── public/           # Static assets and generated JSON data
└── dist/             # Production build output (generated)
```

## Key Features

1. **Markdown-Powered Articles**: Blog posts are written in Markdown with frontmatter metadata and converted to JSON during build
2. **Responsive Design**: Fully responsive layout for desktop and mobile
3. **Theme Support**: Dark/Light theme switching
4. **Client-Side Routing**: Custom router implementation for smooth page transitions
5. **Type-Safe**: Full TypeScript implementation
6. **Personal Sections**: Books (currently reading/recently read), photography showcase, about section
7. **No Framework Overhead**: Pure HTML/CSS/JS implementation without React or other frameworks

## Development Workflow

### Running Locally

```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Convert articles + build HTML version for production
npm run preview      # Convert articles + build + preview production build
npm test            # Run Vitest tests (HTML version)
npm run lint        # Run ESLint
npm run convert     # Manually convert markdown articles to JSON
npm run lint:html   # Lint only HTML version code
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
2. Builds the HTML/CSS/JS application with Vite
3. Outputs everything to `public_html/dist/` for deployment

## Code Conventions

- **Component Structure**: Feature-based organization in `public_html/`
- **TypeScript**: Strict typing throughout
- **File Extensions**: `.ts` for TypeScript modules, `.html` for components/pages
- **CSS**: Pure CSS with CSS modules for component-specific styles
- **No JSX**: Pure HTML templates with JavaScript/TypeScript logic

## Important Context

- This is a personal blog/portfolio website
- Content includes technical articles, book reviews, and photography
- The landing page consists of multiple sections (Hero, About, Articles, Books, Photos)
- Articles use GitHub Flavored Markdown (GFM)
- The build script must be run before deployment to convert articles
- **No React**: This is now a pure HTML/CSS/JS implementation
- **No Framework**: Vanilla JavaScript/TypeScript implementation

## Current Git Status

- Working in a git worktree at: `/Users/andrea/.claude-worktrees/byteshutter/pedantic-lichterman`
- Main repository: `/Users/andrea/Documents/Sites/byteshutter`
- Current branch: `pedantic-lichterman`
- Main branch: `main`
- Status: Clean working tree
- Recent commits focus on React removal, HTML implementation, and test fixes

## Common Tasks

### Adding a New Article
1. Create `.md` file in `articles/` directory
2. Add frontmatter with title, excerpt, created_at, and tags
3. Write content in Markdown
4. Run `npm run convert` to generate JSON
5. Article appears automatically on the website

### Making Component Changes
1. Navigate to appropriate directory in `public_html/`
2. Edit `.html` and `.ts` files
3. TypeScript will catch type errors
4. Test with `npm run dev`
5. Verify with `npm run lint`

### Deployment
1. Ensure all markdown articles are written
2. Run `npm run build` to create production build
3. Deploy contents of `public_html/dist/` directory

## Notes for Claude

- Always read existing files before modifying them
- Maintain TypeScript strictness
- Follow existing component structure patterns
- Run the markdown converter when working with articles
- Test changes with `npm run dev` before building
- Respect the existing code organization (feature folders)
- This is a personal project, so changes should align with the existing personal/portfolio nature
- **Important**: This is now a pure HTML/CSS/JS project - no React components or JSX
- Focus on `public_html/` directory for all development work
