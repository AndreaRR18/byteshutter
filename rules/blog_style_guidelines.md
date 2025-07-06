# Personal Blog Style Guidelines

## Core Design Philosophy

### Minimalism First
- Remove all non-essential elements
- Every component must serve a purpose
- White space is a design feature, not empty space
- Content hierarchy through typography, not decoration

### Readability Priority
- Text legibility over visual flair
- Comfortable reading experience on all devices
- Consistent vertical rhythm
- Optimal line length (45-75 characters)

## Color Scheme & Theming

### Dark Mode (Primary)
```css
--bg-primary: #0a0a0a
--bg-secondary: #1a1a1a
--text-primary: #ffffff
--text-secondary: #a0a0a0
--accent: #3b82f6
--border: #2a2a2a
```

### Light Mode Support
```css
--bg-primary: #ffffff
--bg-secondary: #f8f9fa
--text-primary: #1a1a1a
--text-secondary: #6b7280
--accent: #2563eb
--border: #e5e7eb
```

### Theme Implementation
- Use CSS custom properties for all colors
- Single toggle switches entire theme
- Respect user's system preference by default
- Smooth transitions between themes (200ms)

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
             sans-serif;
```

### Hierarchy
- **H1**: 2.5rem, 700 weight, 1.2 line-height
- **H2**: 2rem, 600 weight, 1.3 line-height  
- **H3**: 1.5rem, 600 weight, 1.4 line-height
- **H4**: 1.25rem, 500 weight, 1.4 line-height
- **Body**: 1rem, 400 weight, 1.6 line-height
- **Small**: 0.875rem, 400 weight, 1.5 line-height

### Code Typography
```css
font-family: 'SF Mono', Monaco, 'Cascadia Code', 
             'Roboto Mono', Consolas, monospace;
```

## Layout Structure

### Grid System
- Max content width: 768px
- Horizontal padding: 2rem desktop, 1rem mobile
- Vertical spacing: 4rem between sections
- Article content: 65ch max-width for optimal readability

### Navigation
- Fixed header with transparent background
- Minimal navigation items (Home, Articles, About)
- Search functionality (if needed)
- Theme toggle button
- Mobile hamburger menu below 768px

### Article Layout
```
[Header - Fixed]
[Hero/Title Area]
[Article Metadata]
[Content with TOC]
[Footer]
```

## Content Presentation

### Article Cards
- Title, excerpt, date, read time
- No thumbnails unless essential
- Hover effects: subtle scale (1.02) + shadow
- Clean date formatting: "Jan 15, 2024"

### Article Pages
- Article title (H1)
- Metadata: Date, read time, tags
- Table of contents for long articles
- Progressive reading indicator
- Social sharing (minimal icons)

### Code Blocks
- Syntax highlighting with subtle colors
- Line numbers for blocks >10 lines
- Copy button on hover
- Language indicator
- Horizontal scroll on mobile

### Images
- Lazy loading implementation
- Responsive with max-width: 100%
- Caption support below images
- Click to expand for detailed images
- Alt text mandatory for accessibility

## Responsive Design

### Breakpoints
```css
/* Mobile */
@media (max-width: 767px)

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px)

/* Desktop */
@media (min-width: 1024px)
```

### Mobile Optimizations
- Touch-friendly tap targets (44px minimum)
- Readable text without zooming
- Simplified navigation
- Optimized image sizes
- Faster loading times

## Performance Guidelines

### Bundle Optimization
- Code splitting by route
- Lazy load non-critical components
- Tree shaking for unused code
- Minimize external dependencies

### Image Optimization
- WebP format with fallbacks
- Multiple sizes for responsive images
- Compression without quality loss
- Preload hero images

### Loading Strategy
- Critical CSS inlined
- Non-critical CSS deferred
- Font loading optimization
- Progressive enhancement

## Accessibility

### WCAG Compliance
- 4.5:1 contrast ratio minimum
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators visible
- Semantic HTML structure

### Implementation
- Alt text for all images
- ARIA labels for interactive elements
- Skip navigation links
- Proper heading hierarchy
- Color not the sole information indicator

## Animation & Interactions

### Subtle Animations
- Page transitions: 300ms ease-out
- Hover effects: 200ms ease
- Loading states with skeleton screens
- Smooth scrolling for anchor links

### Micro-interactions
- Button hover/focus states
- Link underline animations
- Form input focus effects
- Theme toggle animation

## Content Guidelines

### Markdown Support
- Standard markdown syntax
- Code syntax highlighting
- Table support
- Custom callout blocks
- Math notation (if needed)

### Front Matter Structure
```yaml
---
title: "Article Title"
date: "2024-01-15"
excerpt: "Brief description"
tags: ["react", "typescript"]
readTime: 5
published: true
---
```

### SEO Optimization
- Semantic HTML structure
- Meta descriptions from excerpts
- Open Graph tags
- JSON-LD structured data
- Sitemap generation

## Technical Implementation

### Component Architecture
- Atomic design principles
- Reusable UI components
- Custom hooks for common logic
- TypeScript for type safety

### Routing Strategy
- Hash-based routing for GitHub Pages
- Clean URLs when possible
- 404 page for invalid routes
- Breadcrumb navigation

### Build Process
- TypeScript compilation
- CSS processing and minification
- Asset optimization
- Static file generation for GitHub Pages

---

*Remember: Every element should enhance readability and user experience. When in doubt, choose simplicity over complexity.*