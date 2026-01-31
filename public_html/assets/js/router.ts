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
    this.basePath = options.basePath || '';
    this.notFoundHandler = options.notFoundHandler || null;
    this.init();
  }

  private init(): void {
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

  private async loadPage(pageName: string, data: Record<string, any> = {}): Promise<void> {
    try {
      // Load page content
      const response = await fetch(`${this.basePath}/pages/${pageName}.html`);
      
      if (!response.ok) {
        throw new Error(`Failed to load ${pageName} page: ${response.status}`);
      }
      
      const html = await response.text();
      const pageContent = document.getElementById('page-content');
      
      if (pageContent) {
        pageContent.innerHTML = html;
        
        // Load page-specific CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = `${this.basePath}/assets/css/${pageName}.css`;
        cssLink.id = `css-${pageName}`;
        
        // Remove previous page CSS
        const oldCss = document.getElementById(`css-${this.currentRoute?.path.split('/')[1] || 'home'}`);
        if (oldCss) oldCss.remove();
        
        document.head.appendChild(cssLink);
        
        // Load page-specific JS
        const jsScript = document.createElement('script');
        jsScript.type = 'module';
        jsScript.src = `${this.basePath}/assets/js/pages/${pageName}.js`;
        jsScript.id = `js-${pageName}`;
        
        // Remove previous page JS
        const oldJs = document.getElementById(`js-${this.currentRoute?.path.split('/')[1] || 'home'}`);
        if (oldJs) oldJs.remove();
        
        document.body.appendChild(jsScript);
        
        // Dispatch page load event
        window.dispatchEvent(new CustomEvent('page-load', {
          detail: { pageName, data }
        }));
      }
    } catch (error) {
      console.error(`Error loading ${pageName} page:`, error);
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
  (window as any).router = router;
}

export { Router, router };

export type { Route, RouterOptions };