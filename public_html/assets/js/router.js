// Client-side Router
// Replaces React Router

class Router {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
    this.init();
  }

  init() {
    // Set up route definitions
    this.addRoute('/', this.loadHomePage);
    this.addRoute('/about', this.loadAboutPage);
    this.addRoute('/articles', this.loadArticlesPage);
    this.addRoute('/articles/:slug', this.loadArticlePage);
    
    // Handle initial route
    window.addEventListener('DOMContentLoaded', () => this.handleRoute());
    
    // Handle navigation
    window.addEventListener('popstate', () => this.handleRoute());
    
    // Intercept link clicks for client-side navigation
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href]') && !e.target.hasAttribute('target')) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        this.navigate(href);
      }
    });
  }

  addRoute(path, handler) {
    this.routes.push({ path, handler });
  }

  async handleRoute() {
    const path = window.location.pathname;
    const route = this.findMatchingRoute(path);
    
    if (route) {
      this.currentRoute = route;
      
      // Show loading state
      this.showLoading();
      
      try {
        // Execute route handler
        await route.handler(path);
        
        // Update active navigation
        this.updateActiveNavigation();
        
        // Focus main content for accessibility
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
        }
      } catch (error) {
        console.error('Route handling error:', error);
        this.showError();
      }
    } else {
      this.show404();
    }
  }

  findMatchingRoute(path) {
    // Exact match first
    const exactMatch = this.routes.find(route => route.path === path);
    if (exactMatch) return exactMatch;
    
    // Dynamic route match (e.g., /articles/:slug)
    const dynamicMatch = this.routes.find(route => {
      const routeParts = route.path.split('/');
      const pathParts = path.split('/');
      
      if (routeParts.length !== pathParts.length) return false;
      
      return routeParts.every((part, index) => 
        part === pathParts[index] || part.startsWith(':')
      );
    });
    
    if (dynamicMatch) {
      return {
        ...dynamicMatch,
        params: this.extractParams(dynamicMatch.path, path)
      };
    }
    
    return null;
  }

  extractParams(routePath, actualPath) {
    const routeParts = routePath.split('/');
    const pathParts = actualPath.split('/');
    const params = {};
    
    routeParts.forEach((part, index) => {
      if (part.startsWith(':')) {
        const paramName = part.substring(1);
        params[paramName] = pathParts[index];
      }
    });
    
    return params;
  }

  navigate(path) {
    history.pushState({}, '', path);
    this.handleRoute();
  }

  async loadHomePage() {
    await this.loadPage('home');
  }

  async loadAboutPage() {
    await this.loadPage('about');
  }

  async loadArticlesPage() {
    await this.loadPage('articles');
  }

  async loadArticlePage(path) {
    const slug = path.split('/').pop();
    await this.loadPage('article', { slug });
  }

  async loadPage(pageName, data = {}) {
    try {
      // Load page content
      const response = await fetch(`/pages/${pageName}.html`);
      
      if (!response.ok) {
        throw new Error(`Failed to load ${pageName} page`);
      }
      
      const html = await response.text();
      const pageContent = document.getElementById('page-content');
      
      if (pageContent) {
        pageContent.innerHTML = html;
        
        // Load page-specific CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = `/assets/css/${pageName}.css`;
        cssLink.id = `css-${pageName}`;
        
        // Remove previous page CSS
        const oldCss = document.getElementById(`css-${this.currentRoute?.path.split('/')[1] || 'home'}`);
        if (oldCss) oldCss.remove();
        
        document.head.appendChild(cssLink);
        
        // Load page-specific JS
        const jsScript = document.createElement('script');
        jsScript.type = 'module';
        jsScript.src = `/assets/js/pages/${pageName}.js`;
        jsScript.id = `js-${pageName}`;
        
        // Remove previous page JS
        const oldJs = document.getElementById(`js-${this.currentRoute?.path.split('/')[1] || 'home'}`);
        if (oldJs) oldJs.remove();
        
        document.body.appendChild(jsScript);
      }
    } catch (error) {
      console.error(`Error loading ${pageName} page:`, error);
      this.showError();
    }
  }

  showLoading() {
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      pageContent.innerHTML = '<div class="loading">Loading...</div>';
    }
  }

  showError() {
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      pageContent.innerHTML = '<div class="error"><h2>Error Loading Page</h2><p>Sorry, there was an error loading this page.</p><button onclick="window.router.navigate(\'/\')" class="btn">Go to Home</button></div>';
    }
  }

  show404() {
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      pageContent.innerHTML = '<div class="error"><h2>404 - Page Not Found</h2><p>The page you\'re looking for doesn\'t exist.</p><button onclick="window.router.navigate(\'/\')" class="btn">Go to Home</button></div>';
    }
  }

  updateActiveNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === window.location.pathname) {
        link.classList.add('active');
      }
    });
  }
}

// Initialize router
const router = new Router();

// Export for other modules
if (typeof window !== 'undefined') {
  window.router = router;
}

export { Router, router };