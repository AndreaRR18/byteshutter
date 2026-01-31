// Theme Management System
// Replaces React's useTheme hook

class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.init();
  }

  init() {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.currentTheme = savedTheme || systemTheme;
    
    // Apply theme
    this.applyTheme(this.currentTheme);
    
    // Set up system theme change listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    
    // Save preference if not system default
    if (theme !== (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) {
      localStorage.setItem('theme', theme);
    } else {
      localStorage.removeItem('theme');
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Export for other modules
if (typeof window !== 'undefined') {
  window.themeManager = themeManager;
}

export { ThemeManager, themeManager };