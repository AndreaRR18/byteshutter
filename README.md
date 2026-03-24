# ByteShutter

ByteShutter is a modern, responsive blog website built with plain HTML, CSS, and JavaScript. The site features articles about web development, iOS development, Swift, SwiftUI, and responsive design principles.

## Features

- **No Build Step**: Plain HTML/CSS/JS — no framework, no bundler
- **Markdown-Powered**: Articles are written in Markdown format and automatically converted to JSON for the frontend
- **Responsive Design**: Fully responsive layout that works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Built-in theme switching capability
- **Hash-Based Routing**: Fast client-side navigation using URL hash fragments

## Running Locally

### Prerequisites

Make sure you have Node.js installed on your system.

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd byteshutter
```

2. Install dependencies:
```bash
npm install
```

### Development

To convert articles and serve the site locally on port 3000:

```bash
npm run dev
```

The site will be available at `http://localhost:3000`.

### Building for Production

To create a production build:

```bash
npm run build
```

This command will:
1. Convert all markdown articles in the `articles/` folder to JSON format
2. Copy all site files to the `dist/` directory

### Other Available Scripts

- `npm run convert` - Manually convert markdown articles to JSON format

## CI/CD & Deployment

### Deployment

Merging to `main` automatically deploys the site to GitHub Pages.

### Releasing a New Version

Tag a commit with a semantic version to create a GitHub Release with an auto-generated changelog:

```bash
git tag v1.0.0
git push origin v1.0.0
```

## Project Structure

```
byteshutter/
├── articles/          # Markdown source files for blog posts
├── css/               # Stylesheets
├── js/                # JavaScript files (articles.js, article.js, theme.js)
├── data/              # Generated JSON data from articles
├── images/            # Static image assets
├── scripts/           # Build scripts for article conversion
├── index.html         # Home page
├── articles.html      # Articles listing page
├── article.html       # Article detail page
├── about.html         # About page
└── dist/              # Production build output
```

## Adding New Articles

1. Create a new `.md` file in the `articles/` directory
2. Include frontmatter with title, excerpt, created_at, and tags
3. Write your article content in Markdown format
4. Run `npm run convert` to generate the JSON files
5. The article will automatically appear on the website

Example article format:
```markdown
---
title: "Your Article Title"
excerpt: "A brief description of your article"
created_at: 2024-01-01
tags: ["tag1", "tag2"]
---

Your article content here...
```
