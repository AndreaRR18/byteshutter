// Header Component
// Manages header functionality including theme toggle and navigation

interface HeaderOptions {
  themeToggleSelector?: string;
  navLinkSelector?: string;
  activeNavClass?: string;
}

class HeaderComponent {
  private options: HeaderOptions;
  private headerElement: HTMLElement | null;
  private themeToggleButton: HTMLElement | null;
  private navLinks: NodeListOf<HTMLElement>;

  constructor(options: HeaderOptions = {}) {
    this.options = {
      themeToggleSelector: '[data-theme-toggle]',
      navLinkSelector: '.nav-link',
      activeNavClass: 'active',
      ...options
    };
    
    this.headerElement = document.querySelector('.site-header') as HTMLElement | null;
    this.themeToggleButton = document.querySelector(this.options.themeToggleSelector) as HTMLElement | null;
    this.navLinks = document.querySelectorAll(this.options.navLinkSelector) as NodeListOf<HTMLElement>;
    
    this.init();
  }

  private init(): void {
    if (!this.headerElement) {
      console.warn('Header element not found');
      return;
    }
    
    this.setupThemeToggle();
    this.setupNavigation();
    this.updateActiveNavigation();
    
    // Dispatch component ready event
    window.dispatchEvent(new CustomEvent('component-ready', {
      detail: { component: 'header' }
    }));
  }

  private setupThemeToggle(): void {
    if (this.themeToggleButton) {
      this.themeToggleButton.addEventListener('click', () => {
        if (window.themeManager) {
          window.themeManager.toggleTheme();
          this.updateThemeIcon();
        }
      });
      
      // Initialize theme icon
      this.updateThemeIcon();
      
      // Listen for theme changes
      window.addEventListener('theme-change', () => {
        this.updateThemeIcon();
      });
    }
  }

  private updateThemeIcon(): void {
    if (this.themeToggleButton) {
      const isDark = window.themeManager?.isDarkMode();
      const icon = this.themeToggleButton.querySelector('.theme-icon');
      
      if (icon) {
        icon.textContent = isDark ? '☀️' : '🌙';
      }
    }
  }

  private setupNavigation(): void {
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Handle client-side navigation
        const href = link.getAttribute('href');
        if (href && href.startsWith('/')) {
          if (window.router) {
            window.router.navigate(href);
          }
        }
      });
    });
    
    // Listen for route changes to update active navigation
    window.addEventListener('route-change', () => {
      this.updateActiveNavigation();
    });
  }

  private updateActiveNavigation(): void {
    const currentPath = window.location.pathname;
    
    this.navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      
      if (linkPath === currentPath) {
        link.classList.add(this.options.activeNavClass || 'active');
      } else {
        link.classList.remove(this.options.activeNavClass || 'active');
      }
    });
  }

  public destroy(): void {
    if (this.themeToggleButton) {
      this.themeToggleButton.removeEventListener('click', this.updateThemeIcon);
    }
    
    this.navLinks.forEach(link => {
      link.removeEventListener('click', this.updateActiveNavigation);
    });
  }

  public getOptions(): HeaderOptions {
    return this.options;
  }
}

// Initialize header component when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new HeaderComponent();
});

// Export for testing
export { HeaderComponent };

export type { HeaderOptions };