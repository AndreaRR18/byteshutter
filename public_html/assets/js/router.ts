// Client-side Router
// Replaces React Router

interface Route {
  path: string;
  handler: (path: string) => Promise<void>;
  params?: Record<string, string>;
}

interface RouterOptions {
  basePath?: string;
  notFoundHandler?: (path: string) => Promise<void>;
}

class Router {
  private routes: Route[] = [];
  private currentRoute: Route | null = null;
  private basePath: string;
  private notFoundHandler: ((path: string) => Promise<void>) | null;

  constructor(options: RouterOptions = {}) {
    // Auto-detect base path from script location if not provided
    this.basePath = options.basePath || this.detectBasePath();
    console.log(`[Router] Constructor - basePath: ${this.basePath}`);
    this.notFoundHandler = options.notFoundHandler || null;
    this.init();
  }
  
  private detectBasePath(): string {
    // Try to detect base path from the current script location
    try {
      // Check if we're running in a browser environment
      if (typeof document !== 'undefined') {
        // Look for our script in the document
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          const src = scripts[i].src;
          if (src.includes('main.js') || src.includes('router.ts')) {
            // Extract the base path from the script URL
            const scriptPath = new URL(src, document.baseURI).pathname;
            const basePath = scriptPath.substring(0, scriptPath.lastIndexOf('/'));
            return basePath.replace(/\/assets\/js$/, '');
          }
        }
      }
    } catch (error) {
      console.warn('Could not auto-detect base path:', error);
    }
    
    // Fallback to empty string or check for common base paths
    return this.checkCommonBasePaths() || '';
  }
  
  private checkCommonBasePaths(): string | null {
    // Check for common base paths in the current URL
    const path = window.location.pathname;
    
    // Check if we're in a /byteshutter/ subdirectory
    if (path.startsWith('/byteshutter/')) {
      return '/byteshutter';
    }
    
    // Check if we're in a /dist/ subdirectory
    if (path.startsWith('/dist/')) {
      return '/dist';
    }
    
    return null;
  }

  private init(): void {
    // Set up route definitions
    this.addRoute('/', this.loadHomePage);
    this.addRoute('/about', this.loadAboutPage);
    this.addRoute('/articles', this.loadArticlesPage);
    this.addRoute('/articles/:slug', this.loadArticlePage);
    
    // Handle initial route (will be called by main app)
    // window.addEventListener('DOMContentLoaded', () => this.handleRoute());
    
    // Handle navigation
    window.addEventListener('popstate', () => this.handleRoute());
    
    // Intercept link clicks for client-side navigation
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.matches('a[href]') && !target.hasAttribute('target')) {
        e.preventDefault();
        const href = target.getAttribute('href');
        if (href) {
          this.navigate(href);
        }
      }
    });
  }

  public addRoute(path: string, handler: (path: string) => Promise<void>): void {
    this.routes.push({ path, handler });
  }

  public async handleRoute(): Promise<void> {
    const path = window.location.pathname.replace(this.basePath, '');
    console.log(`[Router] Handling route for path: ${path}`);
    
    const route = this.findMatchingRoute(path);
    console.log(`[Router] Found route:`, route);
    
    if (route) {
      this.currentRoute = route;
      console.log(`[Router] Current route set to:`, this.currentRoute);
      
      // Show loading state
      this.showLoading();
      
      try {
        // Execute route handler
        console.log(`[Router] Executing route handler for ${path}`);
        await route.handler(path);
        
        // Update active navigation
        this.updateActiveNavigation();
        
        // Focus main content for accessibility
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
        }
        
        // Dispatch route change event
        window.dispatchEvent(new CustomEvent('route-change', {
          detail: { path, route }
        }));
      } catch (error) {
        console.error('Route handling error:', error);
        this.showError();
      }
    } else {
      if (this.notFoundHandler) {
        await this.notFoundHandler(path);
      } else {
        this.show404();
      }
    }
  }

  private findMatchingRoute(path: string): Route | null {
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

  private extractParams(routePath: string, actualPath: string): Record<string, string> {
    const routeParts = routePath.split('/');
    const pathParts = actualPath.split('/');
    const params: Record<string, string> = {};
    
    routeParts.forEach((part, index) => {
      if (part.startsWith(':')) {
        const paramName = part.substring(1);
        params[paramName] = pathParts[index];
      }
    });
    
    return params;
  }

  public navigate(path: string): void {
    history.pushState({}, '', this.basePath + path);
    this.handleRoute();
  }

  public async loadHomePage(): Promise<void> {
    await this.loadPage('home');
  }

  public async loadAboutPage(): Promise<void> {
    await this.loadPage('about');
  }

  public async loadArticlesPage(): Promise<void> {
    await this.loadPage('articles');
  }

  public async loadArticlePage(path: string): Promise<void> {
    const slug = path.split('/').pop() || '';
    await this.loadPage('article', { slug });
  }

  private async loadPage(pageName: string, data: Record<string, unknown> = {}): Promise<void> {
    try {
      const pageContent = document.getElementById('page-content');
      if (!pageContent) {
        throw new Error('Page content container not found');
      }
      
      // Show loading state
      pageContent.innerHTML = '<div class="loading">Loading...</div>';
      
      // Simple page loading - try to fetch the page HTML
      try {
        // Try different base paths
        const basePaths = ['', this.basePath, '/byteshutter'];
        let response = null;
        
        for (const base of basePaths) {
          try {
            const url = `${base}/pages/${pageName}.html`;
            console.log(`[Router] Trying to load page from: ${url}`);
            response = await fetch(url);
            if (response.ok) {
              console.log(`[Router] Successfully loaded page from: ${url}`);
              break;
            }
          } catch (error) {
            console.log(`[Router] Failed to load from ${base}:`, error.message);
          }
        }
        
        if (!response || !response.ok) {
          throw new Error(`Could not load ${pageName} page from any location`);
        }
        
        const html = await response.text();
        pageContent.innerHTML = html;
        
        // Load CSS if it exists
        try {
          const cssResponse = await fetch(`${this.basePath}/assets/css/${pageName}.css`);
          if (cssResponse.ok) {
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = `${this.basePath}/assets/css/${pageName}.css`;
            document.head.appendChild(cssLink);
          }
        } catch (cssError) {
          console.log(`[Router] CSS not found for ${pageName}, using global styles`);
        }
        
        // Load JS if it exists
        try {
          const jsResponse = await fetch(`${this.basePath}/assets/js/pages/${pageName}.js`);
          if (jsResponse.ok) {
            const jsScript = document.createElement('script');
            jsScript.type = 'module';
            jsScript.src = `${this.basePath}/assets/js/pages/${pageName}.js`;
            document.body.appendChild(jsScript);
          }
        } catch (jsError) {
          console.log(`[Router] JS not found for ${pageName}, page will work without it`);
        }
        
        // Dispatch page load event
        window.dispatchEvent(new CustomEvent('page-load', {
          detail: { pageName, data }
        }));
        
      } catch (error) {
        console.error(`[Router] Error loading ${pageName}:`, error);
        this.showError();
      }
    } catch (error) {
      console.error(`[Router] Fatal error loading ${pageName}:`, error);
      this.showError();
    }
  }

  private showLoading(): void {
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      pageContent.innerHTML = '<div class="loading">Loading...</div>';
    }
  }

  private showError(): void {
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      pageContent.innerHTML = `
        <div class="error">
          <h2>Error Loading Page</h2>
          <p>Sorry, there was an error loading this page.</p>
          <button onclick="window.router.navigate('/')" class="btn">Go to Home</button>
        </div>
      `;
    }
  }

  private show404(): void {
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      pageContent.innerHTML = `
        <div class="error">
          <h2>404 - Page Not Found</h2>
          <p>The page you're looking for doesn't exist.</p>
          <button onclick="window.router.navigate('/')" class="btn">Go to Home</button>
        </div>
      `;
    }
  }

  private updateActiveNavigation(): void {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === window.location.pathname) {
        link.classList.add('active');
      }
    });
  }

  public getCurrentRoute(): Route | null {
    return this.currentRoute;
  }

  public getRoutes(): Route[] {
    return this.routes;
  }

  public getBasePath(): string {
    return this.basePath;
  }
}

// Initialize router with default options
const router = new Router();

// Export for other modules
if (typeof window !== 'undefined') {
  (window as { router?: Router }).router = router;
}

export { Router, router };

export type { Route, RouterOptions };