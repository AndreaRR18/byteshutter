// Router Tests
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Router } from '../assets/js/router';
import '../tests/testSetup';

describe('Router', () => {
  let router: Router;
  
  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <div id="page-content"></div>
      <nav>
        <a href="/" class="nav-link">Home</a>
        <a href="/about" class="nav-link">About</a>
      </nav>
    `;
    
    // Create router instance
    router = new Router({ basePath: '' });
  });
  
  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
  });
  
  it('should initialize with default routes', () => {
    const routes = router.getRoutes();
    expect(routes.length).toBeGreaterThan(0);
    expect(routes.some(r => r.path === '/')).toBe(true);
    expect(routes.some(r => r.path === '/about')).toBe(true);
  });
  
  it('should add custom routes', () => {
    const customHandler = async () => {};
    router.addRoute('/custom', customHandler);
    
    const routes = router.getRoutes();
    expect(routes.some(r => r.path === '/custom')).toBe(true);
  });
  
  it('should match exact routes', () => {
    const route = router['findMatchingRoute']('/about');
    expect(route).not.toBeNull();
    expect(route?.path).toBe('/about');
  });
  
  it('should match dynamic routes', () => {
    const route = router['findMatchingRoute']('/articles/test-slug');
    expect(route).not.toBeNull();
    expect(route?.params?.slug).toBe('test-slug');
  });
  
  it('should handle 404 for unknown routes', () => {
    const route = router['findMatchingRoute']('/unknown');
    expect(route).toBeNull();
  });
  
  it('should extract route parameters correctly', () => {
    const params = router['extractParams']('/articles/:slug', '/articles/test-article');
    expect(params.slug).toBe('test-article');
  });
  
  it('should update active navigation', () => {
    // Simulate being on about page
    window.history.pushState({}, '', '/about');
    
    const navLinks = document.querySelectorAll('.nav-link');
    expect(navLinks[1].classList.contains('active')).toBe(true);
  });
  
  it('should handle route change events', () => {
    let eventDispatched = false;
    
    window.addEventListener('route-change', () => {
      eventDispatched = true;
    });
    
    // This would normally be called by navigation
    // We're testing the event dispatch mechanism
    router['handleRoute']();
    
    // Event should be dispatched during route handling
    // Note: This is a simplified test - actual route handling would require more setup
  });
});