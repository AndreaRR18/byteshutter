// Theme Manager Tests
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ThemeManager } from '../assets/js/theme';
import '../tests/testSetup';

describe('ThemeManager', () => {
  let themeManager: ThemeManager;
  
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Create theme manager instance
    themeManager = new ThemeManager({ storageKey: 'test-theme' });
  });
  
  afterEach(() => {
    // Clean up
    localStorage.clear();
  });
  
  it('should initialize with default theme', () => {
    expect(themeManager.getCurrentTheme()).toBeDefined();
    expect(['light', 'dark']).toContain(themeManager.getCurrentTheme());
  });
  
  it('should toggle theme correctly', () => {
    const initialTheme = themeManager.getCurrentTheme();
    themeManager.toggleTheme();
    
    const newTheme = themeManager.getCurrentTheme();
    expect(newTheme).not.toBe(initialTheme);
    expect(newTheme).toBe(initialTheme === 'light' ? 'dark' : 'light');
  });
  
  it('should persist theme in localStorage', () => {
    themeManager.applyTheme('dark');
    expect(localStorage.getItem('test-theme')).toBe('dark');
    
    // Create new instance - should load from localStorage
    const newThemeManager = new ThemeManager({ storageKey: 'test-theme' });
    expect(newThemeManager.getCurrentTheme()).toBe('dark');
  });
  
  it('should detect system theme preference', () => {
    // Mock system theme
    const systemTheme = themeManager.getSystemTheme();
    expect(['light', 'dark']).toContain(systemTheme);
  });
  
  it('should apply theme to document', () => {
    themeManager.applyTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    
    themeManager.applyTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });
  
  it('should dispatch theme change events', () => {
    let eventDispatched = false;
    
    window.addEventListener('theme-change', (e: CustomEvent) => {
      eventDispatched = true;
      expect(e.detail.theme).toBe('dark');
    });
    
    themeManager.applyTheme('dark');
    expect(eventDispatched).toBe(true);
  });
  
  it('should handle theme methods correctly', () => {
    themeManager.applyTheme('dark');
    expect(themeManager.isDarkMode()).toBe(true);
    expect(themeManager.isLightMode()).toBe(false);
    
    themeManager.applyTheme('light');
    expect(themeManager.isDarkMode()).toBe(false);
    expect(themeManager.isLightMode()).toBe(true);
  });
});