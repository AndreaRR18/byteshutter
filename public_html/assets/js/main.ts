// Main Application Script
// Initializes the HTML/CSS version of ByteShutter

import { router } from './router';
import { themeManager } from './theme';

interface AppOptions {
  autoInit?: boolean;
  debug?: boolean;
}

class App {
  private options: AppOptions;

  constructor(options: AppOptions = {}) {
    this.options = {
      autoInit: true,
      debug: false,
      ...options
    };
    
    if (this.options.autoInit) {
      this.init();
    }
  }

  public async init(): Promise<void> {
    try {
      if (this.options.debug) {
        console.log('Initializing ByteShutter HTML/CSS app...');
      }
      
      // Initialize components
      await this.loadHeader();
      await this.loadFooter();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Initialize utilities
      this.initUtilities();
      
      if (this.options.debug) {
        console.log('ByteShutter HTML/CSS app initialized successfully');
      }
    } catch (error) {
      console.error('App initialization error:', error);
      if (this.options.debug) {
        console.error('Detailed error:', error);
      }
    }
  }

  private async loadHeader(): Promise<void> {
    try {
      const response = await fetch('/components/header.html');
      if (response.ok) {
        const html = await response.text();
        const headerContainer = document.getElementById('header-container');
        
        if (headerContainer) {
          headerContainer.innerHTML = html;
          
          // Load header CSS
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = '/assets/css/header.css';
          document.head.appendChild(cssLink);
          
          // Load header JS
          const jsScript = document.createElement('script');
          jsScript.type = 'module';
          jsScript.src = '/assets/js/components/header.js';
          document.body.appendChild(jsScript);
        }
      }
    } catch (error) {
      console.error('Error loading header:', error);
    }
  }

  private async loadFooter(): Promise<void> {
    try {
      const response = await fetch('/components/footer.html');
      if (response.ok) {
        const html = await response.text();
        const footerContainer = document.getElementById('footer-container');
        
        if (footerContainer) {
          footerContainer.innerHTML = html;
          
          // Load footer CSS
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = '/assets/css/footer.css';
          document.head.appendChild(cssLink);
          
          // Load footer JS
          const jsScript = document.createElement('script');
          jsScript.type = 'module';
          jsScript.src = '/assets/js/components/footer.js';
          document.body.appendChild(jsScript);
        }
      }
    } catch (error) {
      console.error('Error loading footer:', error);
    }
  }

  private setupEventListeners(): void {
    // Theme toggle button
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-theme-toggle]')) {
        themeManager.toggleTheme();
      }
    });
    
    // Route change events
    window.addEventListener('route-change', (e: CustomEvent) => {
      if (this.options.debug) {
        console.log('Route changed:', e.detail);
      }
    });
    
    // Theme change events
    window.addEventListener('theme-change', (e: CustomEvent) => {
      if (this.options.debug) {
        console.log('Theme changed:', e.detail);
      }
    });
  }

  private initUtilities(): void {
    // Initialize lazy loading for images
    this.initLazyLoading();
    
    // Set up error handling
    this.setupErrorHandling();
  }

  private initLazyLoading(): void {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px',
      threshold: 0.1
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  private setupErrorHandling(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
    });
    
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled rejection:', event.reason);
    });
  }

  // Utility methods
  public static preloadImages(imageUrls: string[]): void {
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }

  public static async fetchData(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Data fetch error:', error);
      throw error;
    }
  }

  public static formatDate(dateString: string, format: string = 'MMMM d, yyyy'): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  public getOptions(): AppOptions {
    return this.options;
  }

  public setDebug(debug: boolean): void {
    this.options.debug = debug;
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new App({ debug: import.meta.env.DEV });
});

// Export for testing
export { App };

export type { AppOptions };