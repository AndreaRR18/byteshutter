# ByteShutter

ByteShutter is a modern, responsive blog website built with React, TypeScript, and Vite. The site features articles about web development, iOS development, Swift, SwiftUI, and responsive design principles, along with a comprehensive landing page showcasing books, articles, and photography.

## Features

- **Modern Tech Stack**: Built with React 19.1.0, TypeScript 5.8.3, and Vite 6.3.5 for fast development and optimal performance
- **Comprehensive Landing Page**: Multi-section homepage with hero, about, book recommendations, featured articles, and photography showcase
- **Markdown-Powered**: Articles are written in Markdown format with GitHub Flavored Markdown support and automatically converted to JSON for the frontend
- **Responsive Design**: Fully responsive layout that works seamlessly on desktop and mobile devices
- **Advanced Theme System**: Smart dark/light theme switching with system preference detection, localStorage persistence, and smooth transitions
- **Fast Navigation**: Client-side routing with React Router 7.6.1 for smooth page transitions
- **Type-Safe**: Full TypeScript implementation with strict mode for better developer experience and code reliability
- **Testing Ready**: Vitest testing framework with React Testing Library integration
- **Code Quality**: ESLint with TypeScript rules for consistent code quality
- **GitHub Pages Ready**: Configured for seamless deployment to GitHub Pages

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

The site will be available at `http://localhost:3000`.

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
- `npm run test:ui` - Run tests with Vitest UI interface
- `npm run lint` - Check code quality with ESLint
- `npm run convert` - Manually convert markdown articles to JSON format

## Project Structure

```
byteshutter/
├── articles/          # Markdown articles
├── src/              # React application source code
│   ├── components/   # Reusable React components
│   ├── pages/        # Page components
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   └── types/        # TypeScript type definitions
├── scripts/          # Build scripts for article conversion
├── public/           # Static assets and generated JSON data
├── rules/            # Development guidelines and style guides
├── tests/            # Test files
├── resources/        # Additional resources and images
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
tags: ["swift", "programming", "tutorial"]
---

Your article content here...
```

## Development Guidelines

The project includes comprehensive development guidelines in the `/rules` directory:
- **Blog Style Guidelines**: Design philosophy and visual consistency standards
- **React Component Guidelines**: Best practices for component development
- **TypeScript Coding Standards**: Type safety and code quality standards

## Testing

The project uses **Vitest** for testing with React Testing Library integration:

```bash
# Run tests
npm test

# Run tests with UI interface
npm run test:ui
```

## Deployment

ByteShutter is configured for GitHub Pages deployment. The build process automatically optimizes the application for static hosting with the appropriate base path configuration.

## Theme System

The advanced theme system includes:
- Automatic system preference detection
- Manual theme switching capability
- localStorage persistence across sessions
- Smooth CSS transitions between themes
- Support for both light and dark color schemes
