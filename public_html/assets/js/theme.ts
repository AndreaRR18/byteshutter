// Theme Management System
// Replaces React's useTheme hook

interface ThemeManagerOptions {
  defaultTheme?: 'light' | 'dark';
  storageKey?: string;
}

class ThemeManager {
  private currentTheme: 'light' | 'dark' | null = null;
  private storageKey: string;
  private systemThemeMedia: MediaQueryList;

  constructor(options: ThemeManagerOptions = {}) {
    this.storageKey = options.storageKey || 'theme';
    this.systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    this.init();
  }

  private init(): void {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem(this.storageKey) as 'light' | 'dark' | null;
    const systemTheme = this.systemThemeMedia.matches ? 'dark' : 'light';
    this.currentTheme = savedTheme || systemTheme;
    
    // Apply theme
    this.applyTheme(this.currentTheme);
    
    // Set up system theme change listener
    this.systemThemeMedia.addEventListener('change', (e) => {
      if (!localStorage.getItem(this.storageKey)) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  public applyTheme(theme: 'light' | 'dark'): void {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    
    // Save preference if not system default
    const systemTheme = this.systemThemeMedia.matches ? 'dark' : 'light';
    if (theme !== systemTheme) {
      localStorage.setItem(this.storageKey, theme);
    } else {
      localStorage.removeItem(this.storageKey);
    }
    
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('theme-change', {
      detail: { theme }
    }));
  }

  public toggleTheme(): void {
    if (!this.currentTheme) return;
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  public getCurrentTheme(): 'light' | 'dark' | null {
    return this.currentTheme;
  }

  public getSystemTheme(): 'light' | 'dark' {
    return this.systemThemeMedia.matches ? 'dark' : 'light';
  }

  public isDarkMode(): boolean {
    return this.currentTheme === 'dark';
  }

  public isLightMode(): boolean {
    return this.currentTheme === 'light';
  }
}

// Initialize theme manager with default options
const themeManager = new ThemeManager();

// Export for other modules
if (typeof window !== 'undefined') {
  (window as any).themeManager = themeManager;
}

export { ThemeManager, themeManager };

export type { ThemeManagerOptions };