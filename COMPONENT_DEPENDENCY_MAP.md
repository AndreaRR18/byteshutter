# Component Dependency Map

## Overview
This document maps the React components to their HTML/CSS equivalents and documents their dependencies.

## Component Hierarchy

### Root Components
```
App.tsx
├── Header.tsx
├── Main Content (Routes)
│   ├── Landing.tsx
│   ├── BlogList.tsx
│   ├── BlogPost.tsx
│   └── About.tsx
└── Footer.tsx
```

### Landing Page Structure
```
Landing.tsx
├── HeroSection.tsx
├── AboutSection.tsx
├── CurrentlyReadingSection.tsx
├── RecentlyReadBooksSection.tsx
│   └── BookCard.tsx (multiple)
├── InterestingArticlesSection.tsx
└── HighlightedPhotoSection.tsx
```

## Component Migration Plan

### 1. Layout Components

#### Header.tsx
- **HTML Equivalent**: `/components/header.html`
- **CSS Equivalent**: `/assets/css/header.css`
- **JS Equivalent**: `/assets/js/components/header.js`
- **Dependencies**:
  - Theme toggle functionality
  - Navigation links
  - Logo/image assets
- **Props Replaced With**:
  - No props (self-contained component)
- **State Management**:
  - Theme toggle button interacts with `themeManager`

#### Footer.tsx
- **HTML Equivalent**: `/components/footer.html`
- **CSS Equivalent**: `/assets/css/footer.css`
- **JS Equivalent**: `/assets/js/components/footer.js`
- **Dependencies**:
  - Social media links
  - Copyright information
  - Theme toggle button
- **Props Replaced With**:
  - No props (self-contained component)

#### Divider.tsx
- **HTML/CSS Equivalent**: Utility CSS classes
- **Implementation**: `.divider` class in global.css
- **Dependencies**: None
- **Props Replaced With**: CSS customization via classes

#### ErrorBoundary.tsx
- **HTML/CSS Equivalent**: Global error handling
- **Implementation**: Error handling in router.js
- **Dependencies**: None
- **Props Replaced With**: JavaScript error handling

### 2. Landing Page Components

#### HeroSection.tsx
- **HTML Equivalent**: `/pages/sections/hero-section.html`
- **CSS Equivalent**: `/assets/css/sections/hero-section.css`
- **Dependencies**:
  - `heroImage` prop → data attribute or CSS variable
  - Responsive design
  - Call-to-action buttons
- **Props Replaced With**:
  - `heroImage` → CSS background or img src
  - `title`, `subtitle` → HTML content

#### AboutSection.tsx
- **HTML Equivalent**: `/pages/sections/about-section.html`
- **CSS Equivalent**: `/assets/css/sections/about-section.css`
- **Dependencies**:
  - Static content
  - Responsive layout
- **Props Replaced With**: Direct HTML content

#### CurrentlyReadingSection.tsx
- **HTML Equivalent**: `/pages/sections/currently-reading.html`
- **CSS Equivalent**: `/assets/css/sections/currently-reading.css`
- **Dependencies**:
  - `bookCoverImage` prop
  - Book data from books.ts
- **Props Replaced With**:
  - Image URL via data attribute
  - Book data via JavaScript fetch

#### RecentlyReadBooksSection.tsx
- **HTML Equivalent**: `/pages/sections/recently-read-books.html`
- **CSS Equivalent**: `/assets/css/sections/recently-read-books.css`
- **Dependencies**:
  - `books` array prop
  - BookCard component (multiple)
- **Props Replaced With**:
  - Books data via JavaScript
  - BookCard → HTML template with data binding

#### BookCard.tsx
- **HTML Equivalent**: `/pages/sections/book-card.html` (template)
- **CSS Equivalent**: `/assets/css/sections/book-card.css`
- **Dependencies**:
  - Book data (title, author, image, etc.)
  - Click handler for navigation
- **Props Replaced With**:
  - Data attributes for book information
  - Event listeners for interactions

#### InterestingArticlesSection.tsx
- **HTML Equivalent**: `/pages/sections/interesting-articles.html`
- **CSS Equivalent**: `/assets/css/sections/interesting-articles.css`
- **Dependencies**:
  - Articles data
  - External links
- **Props Replaced With**: Direct HTML content with data

#### HighlightedPhotoSection.tsx
- **HTML Equivalent**: `/pages/sections/highlighted-photo.html`
- **CSS Equivalent**: `/assets/css/sections/highlighted-photo.css`
- **Dependencies**:
  - `highlightedPhotoImage` prop
  - Responsive image handling
- **Props Replaced With**: Image URL via data attribute

### 3. Blog Components

#### BlogList.tsx
- **HTML Equivalent**: `/pages/articles.html`
- **CSS Equivalent**: `/assets/css/articles.css`
- **JS Equivalent**: `/assets/js/pages/articles.js`
- **Dependencies**:
  - Articles data from JSON
  - PostCard component (multiple)
  - Search/filter functionality
- **Props Replaced With**:
  - Data fetching via JavaScript
  - PostCard → HTML template

#### BlogPost.tsx
- **HTML Equivalent**: `/pages/article.html` (template)
- **CSS Equivalent**: `/assets/css/article.css`
- **JS Equivalent**: `/assets/js/pages/article.js`
- **Dependencies**:
  - Markdown content
  - Article metadata
  - Code highlighting
  - Comments section
- **Props Replaced With**:
  - Dynamic content loading
  - URL parameters for slug

#### PostCard.tsx
- **HTML Equivalent**: `/pages/components/post-card.html` (template)
- **CSS Equivalent**: `/assets/css/components/post-card.css`
- **Dependencies**:
  - Article data (title, date, excerpt, etc.)
  - Navigation to full article
- **Props Replaced With**:
  - Data attributes for article info
  - Event listeners for clicks

### 4. Page Components

#### Landing.tsx
- **HTML Equivalent**: `/pages/home.html`
- **CSS Equivalent**: `/assets/css/home.css`
- **JS Equivalent**: `/assets/js/pages/home.js`
- **Dependencies**:
  - All landing page sections
  - Image preloading
  - Responsive layout
- **Props Replaced With**:
  - Section composition via HTML includes
  - Data loading via JavaScript

#### About.tsx
- **HTML Equivalent**: `/pages/about.html`
- **CSS Equivalent**: `/assets/css/about.css`
- **JS Equivalent**: `/assets/js/pages/about.js`
- **Dependencies**:
  - Static content
  - Profile information
  - Skills/technologies list
- **Props Replaced With**: Direct HTML content

## Data Flow Migration

### Current React Data Flow
1. **State Management**: React hooks (useState, useEffect)
2. **Props Passing**: Parent → Child component props
3. **Context API**: Theme context for global state
4. **Data Fetching**: useEffect hooks with async/await

### New HTML/CSS Data Flow
1. **State Management**: Vanilla JavaScript with event listeners
2. **Data Passing**: HTML data attributes + JavaScript
3. **Global State**: CSS variables + JavaScript modules
4. **Data Fetching**: Fetch API with async/await

## Specific Migration Examples

### Theme System Migration
```javascript
// React (useTheme hook)
const { theme, toggleTheme } = useTheme();

// HTML/CSS (theme.js)
const currentTheme = themeManager.getCurrentTheme();
themeManager.toggleTheme();
```

### Component Props Migration
```jsx
// React
<HeroSection heroImage={images.hero} title="Welcome" />

// HTML/CSS
<div class="hero-section" 
     data-hero-image="/images/hero.jpg"
     data-title="Welcome">
</div>
```

### Routing Migration
```jsx
// React Router
<Route path="/about" element={<About />} />

// Vanilla JS (router.js)
router.addRoute('/about', router.loadAboutPage);
```

### Data Fetching Migration
```javascript
// React (useEffect)
useEffect(() => {
  fetch('/data/articles.json')
    .then(res => res.json())
    .then(data => setArticles(data));
}, []);

// Vanilla JS
async function loadArticles() {
  const response = await fetch('/data/articles.json');
  const articles = await response.json();
  renderArticles(articles);
}
```

## Dependency Analysis

### External Dependencies to Remove
1. **React** - Core framework
2. **React DOM** - DOM rendering
3. **React Router** - Client-side routing
4. **React Markdown** - Markdown rendering
5. **TypeScript React types** - Type definitions

### External Dependencies to Keep
1. **Vite** - Build tool (modified configuration)
2. **ESLint** - Code linting
3. **Prettier** - Code formatting
4. **gh-pages** - Deployment

### New Dependencies to Add
1. **Marked.js** - Markdown parsing (replaces React Markdown)
2. **Highlight.js** - Code syntax highlighting
3. **LazyLoad** - Image lazy loading

## Image Handling Migration

### Current Implementation
- React component-based image loading
- Dynamic imports for images
- Webpack asset handling

### New Implementation
- HTML img tags with data-src for lazy loading
- JavaScript-based image preloading
- Vite asset handling with public directory

## Performance Considerations

### Current React Performance
- Virtual DOM diffing
- Code splitting with React.lazy
- React hydration
- Bundle size: ~120KB (React + dependencies)

### Expected HTML/CSS Performance
- Direct DOM manipulation
- Manual code splitting
- Progressive enhancement
- Bundle size: ~20KB (vanilla JS + CSS)
- Expected improvement: ~80-90% reduction in JS size

## Accessibility Migration

### Current React Accessibility
- JSX-based ARIA attributes
- React-focused accessibility patterns
- useEffect for focus management

### New HTML/CSS Accessibility
- Native HTML5 accessibility features
- Semantic HTML elements
- Vanilla JS focus management
- Enhanced keyboard navigation

## SEO Migration

### Current React SEO
- React Helmet for meta tags
- Dynamic title/description updates
- Client-side rendering with hydration

### New HTML/CSS SEO
- Static meta tags in HTML
- Server-side rendering approach
- Pre-rendered content for crawlers
- Expected SEO improvement due to faster content availability

## Testing Strategy Migration

### Current React Testing
- Jest + React Testing Library
- Component-based testing
- Snapshot testing

### New HTML/CSS Testing
- Jest for JavaScript modules
- Cypress for end-to-end testing
- Manual component testing
- Visual regression testing

## Build Process Migration

### Current React Build
1. TypeScript compilation
2. React component bundling
3. CSS Modules processing
4. Webpack optimization

### New HTML/CSS Build
1. HTML template processing
2. CSS optimization (PostCSS)
3. JavaScript bundling (Vite)
4. Asset optimization

## Deployment Migration

### Current React Deployment
- Vite build with React plugin
- Single-page application deployment
- Client-side routing configuration

### New HTML/CSS Deployment
- Vite build with HTML entry points
- Multi-page application structure
- Server-side routing friendly

## Risk Assessment by Component

### High Risk Components
1. **BlogPost.tsx** - Complex markdown rendering and code highlighting
2. **Landing.tsx** - Multiple sections with dynamic data
3. **Header.tsx** - Theme switching and navigation
4. **Router system** - Client-side navigation replacement

### Medium Risk Components
1. **BlogList.tsx** - Data fetching and pagination
2. **CurrentlyReadingSection.tsx** - Image handling
3. **RecentlyReadBooksSection.tsx** - Multiple component rendering

### Low Risk Components
1. **AboutSection.tsx** - Static content
2. **Footer.tsx** - Static content
3. **Divider.tsx** - Simple visual element
4. **InterestingArticlesSection.tsx** - Static links

## Migration Priority Order

1. **Core Infrastructure** (Theme, Router, Global CSS)
2. **Layout Components** (Header, Footer)
3. **Static Content Pages** (About)
4. **Landing Page Sections** (Hero, About, etc.)
5. **Dynamic Components** (BookCard, PostCard)
6. **Complex Pages** (BlogList, BlogPost)
7. **Advanced Features** (Markdown, Code highlighting)

## Success Metrics per Component

### Functional Parity
- All features from React version present
- No regression in user experience
- Maintained accessibility standards

### Performance Metrics
- Faster load times
- Reduced bundle size
- Improved Time to Interactive

### Code Quality
- Maintainable HTML/CSS structure
- Well-documented JavaScript
- Consistent coding standards

## Rollback Plan by Component

Each component migration includes:
1. Backup of original React component
2. Feature flags for A/B testing
3. Performance comparison
4. User feedback collection
5. Rollback procedure if needed

## Next Steps

1. [x] Complete component dependency mapping
2. [ ] Begin core infrastructure migration
3. [ ] Implement theme system
4. [ ] Implement routing system
5. [ ] Set up global CSS architecture