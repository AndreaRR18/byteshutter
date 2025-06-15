# ByteShutter

ByteShutter is a modern, responsive blog website built with React, TypeScript, and Vite. The site features articles about web development, iOS development, Swift, SwiftUI, and responsive design principles.

## Features

- **Modern Tech Stack**: Built with React 19, TypeScript, and Vite for fast development and optimal performance
- **Markdown-Powered**: Articles are written in Markdown format and automatically converted to JSON for the frontend
- **Responsive Design**: Fully responsive layout that works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Built-in theme switching capability
- **Fast Navigation**: Client-side routing with React Router for smooth page transitions
- **Type-Safe**: Full TypeScript implementation for better developer experience and code reliability

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

To run the website in development mode with hot reloading:

```bash
npm run dev
```

The site will be available at `http://localhost:5173` (or the next available port).

### Building for Production

To create a production build:

```bash
npm run build
```

This command will:
1. Convert all markdown articles in the `articles/` folder to JSON format
2. Build the React application for production
3. Output the built files to the `dist/` directory

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

### Other Available Scripts

- `npm test` - Run the test suite with Vitest
- `npm run lint` - Check code quality with ESLint
- `npm run convert` - Manually convert markdown articles to JSON format

## Project Structure

```
byteshutter/
├── articles/          # Markdown articles
├── src/              # React application source code
├── scripts/          # Build scripts for article conversion
├── public/           # Static assets and generated JSON data
└── dist/             # Production build output
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
