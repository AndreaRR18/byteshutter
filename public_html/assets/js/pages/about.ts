// About Page Script
// Handles about page specific functionality

interface AboutPageOptions {
  debug?: boolean;
}

class AboutPage {
  private options: AboutPageOptions;

  constructor(options: AboutPageOptions = {}) {
    this.options = {
      debug: false,
      ...options
    };
    
    this.init();
  }

  private init(): void {
    if (this.options.debug) {
      console.log('AboutPage initialized');
    }
    
    this.setupEventListeners();
    this.setupAnimations();
    
    // Dispatch page load event
    window.dispatchEvent(new CustomEvent('page-load', {
      detail: { pageName: 'about' }
    }));
  }

  private setupEventListeners(): void {
    // Set up contact link handlers
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const href = target.getAttribute('href');
        
        if (href && (href.startsWith('http') || href.startsWith('mailto'))) {
          // External links - let them proceed normally
          return;
        }
        
        if (href && window.router) {
          e.preventDefault();
          window.router.navigate(href);
        }
      });
    });
  }

  private setupAnimations(): void {
    // Add fade-in animations to sections
    const sections = document.querySelectorAll('.about-section section');
    
    sections.forEach((section, index) => {
      // Stagger animations
      setTimeout(() => {
        section.classList.add('fade-in');
      }, index * 100);
    });
  }

  public destroy(): void {
    // Clean up event listeners
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
      link.removeEventListener('click', this.setupEventListeners);
    });
  }

  public getOptions(): AboutPageOptions {
    return this.options;
  }
}

// Initialize about page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AboutPage({ debug: import.meta.env.DEV });
});

// Export for testing
export { AboutPage };

export type { AboutPageOptions };