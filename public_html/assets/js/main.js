// Main Application Script
// Initializes the HTML/CSS version of ByteShutter

import { router } from './router.js';
import { themeManager } from './theme.js';

class App {
  constructor() {
    this.init();
  }

  async init() {
    try {
      // Initialize components
      await this.loadHeader();
      await this.loadFooter();
      
      // Set up event listeners
      this.setupEventListeners();
      
      console.log('ByteShutter HTML/CSS app initialized');
    } catch (error) {
      console.error('App initialization error:', error);
    }
  }

  async loadHeader() {
    try {
      const response = await fetch('/components/header.html');
      if (response.ok) {
        const html = await response.text();
        document.getElementById('header-container').innerHTML = html;
        
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
    } catch (error) {
      console.error('Error loading header:', error);
    }
  }

  async loadFooter() {
    try {
      const response = await fetch('/components/footer.html');
      if (response.ok) {
        const html = await response.text();
        document.getElementById('footer-container').innerHTML = html;
        
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
    } catch (error) {
      console.error('Error loading footer:', error);
    }
  }

  setupEventListeners() {
    // Theme toggle button
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-theme-toggle]')) {
        themeManager.toggleTheme();
      }
    });
  }

  // Utility methods
  static preloadImages(imageUrls) {
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }

  static lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});

// Export for testing
export { App };