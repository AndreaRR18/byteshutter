// Performance Optimization Service
// Handles all performance-related optimizations

interface PerformanceServiceOptions {
  debug?: boolean;
  lazyLoad?: boolean;
  preload?: boolean;
  criticalCss?: boolean;
}

class PerformanceService {
  private options: PerformanceServiceOptions;
  private lazyLoadObserver: IntersectionObserver | null = null;
  private preloadedResources: Set<string> = new Set();

  constructor(options: PerformanceServiceOptions = {}) {
    this.options = {
      debug: false,
      lazyLoad: true,
      preload: true,
      criticalCss: true,
      ...options
    };
    
    this.init();
  }

  private init(): void {
    if (this.options.debug) {
      console.log('PerformanceService initialized');
    }
    
    if (this.options.lazyLoad) {
      this.setupLazyLoading();
    }
    
    if (this.options.preload) {
      this.setupPreloading();
    }
    
    this.setupPerformanceMonitoring();
  }

  private setupLazyLoading(): void {
    this.lazyLoadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          
          if (target.tagName === 'IMG' && target.hasAttribute('data-src')) {
            const img = target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.removeAttribute('data-src');
          }
          
          if (target.tagName === 'IFRAME' && target.hasAttribute('data-src')) {
            const iframe = target as HTMLIFrameElement;
            iframe.src = iframe.dataset.src || '';
            iframe.removeAttribute('data-src');
          }
          
          if (target.tagName === 'VIDEO' && target.hasAttribute('data-src')) {
            const video = target as HTMLVideoElement;
            video.src = video.dataset.src || '';
            video.removeAttribute('data-src');
            video.load();
          }
          
          this.lazyLoadObserver?.unobserve(target);
        }
      });
    }, {
      rootMargin: '100px',
      threshold: 0.1
    });
    
    // Start observing lazy load elements
    this.observeLazyElements();
  }

  private observeLazyElements(): void {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const lazyIframes = document.querySelectorAll('iframe[data-src]');
    const lazyVideos = document.querySelectorAll('video[data-src]');
    
    lazyImages.forEach(img => this.lazyLoadObserver?.observe(img));
    lazyIframes.forEach(iframe => this.lazyLoadObserver?.observe(iframe));
    lazyVideos.forEach(video => this.lazyLoadObserver?.observe(video));
  }

  private setupPreloading(): void {
    // Preload critical resources
    const criticalResources = [
      { href: '/assets/css/global.css', as: 'style' },
      { href: '/assets/js/main.ts', as: 'script' },
      { href: '/assets/fonts/roboto.woff2', as: 'font', type: 'font/woff2', crossorigin: true }
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      
      if (resource.type) {
        link.type = resource.type;
      }
      
      if (resource.crossorigin) {
        link.crossOrigin = 'anonymous';
      }
      
      document.head.appendChild(link);
      this.preloadedResources.add(resource.href);
    });
  }

  private setupPerformanceMonitoring(): void {
    // Monitor Web Vitals
    if ('performance' in window) {
      this.monitorWebVitals();
    }
  }

  private monitorWebVitals(): void {
    // First Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntriesByName('first-contentful-paint');
      if (entries.length > 0) {
        const fcp = entries[0].startTime;
        if (this.options.debug) {
          console.log(`FCP: ${fcp.toFixed(2)}ms`);
        }
        
        if (fcp > 1000) {
          console.warn('FCP exceeds recommended threshold (>1000ms)');
        }
      }
    }).observe({ type: 'paint', buffered: true });
    
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntriesByName('largest-contentful-paint');
      if (entries.length > 0) {
        const lcp = entries[0].startTime;
        if (this.options.debug) {
          console.log(`LCP: ${lcp.toFixed(2)}ms`);
        }
        
        if (lcp > 2500) {
          console.warn('LCP exceeds recommended threshold (>2500ms)');
        }
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    
    // Cumulative Layout Shift
    let cls = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      }
      
      if (this.options.debug) {
        console.log(`CLS: ${cls.toFixed(3)}`);
      }
      
      if (cls > 0.1) {
        console.warn('CLS exceeds recommended threshold (>0.1)');
      }
    }).observe({ type: 'layout-shift', buffered: true });
    
    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntriesByName('first-input');
      if (entries.length > 0) {
        const fid = entries[0].processingStart - entries[0].startTime;
        if (this.options.debug) {
          console.log(`FID: ${fid.toFixed(2)}ms`);
        }
        
        if (fid > 100) {
          console.warn('FID exceeds recommended threshold (>100ms)');
        }
      }
    }).observe({ type: 'first-input', buffered: true });
  }

  public preloadResource(href: string, as: string, options: { type?: string; crossorigin?: boolean } = {}): void {
    if (this.preloadedResources.has(href)) {
      return;
    }
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    
    if (options.type) {
      link.type = options.type;
    }
    
    if (options.crossorigin) {
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
    this.preloadedResources.add(href);
  }

  public lazyLoadElement(element: HTMLElement): void {
    if (this.lazyLoadObserver) {
      this.lazyLoadObserver.observe(element);
    }
  }

  public optimizeImages(): void {
    // Find all images and optimize them
    const images = document.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
    
    images.forEach(img => {
      // Add loading="lazy" if not present
      if (!img.hasAttribute('loading')) {
        img.loading = 'lazy';
      }
      
      // Add proper alt text if missing
      if (!img.hasAttribute('alt') || img.alt === '') {
        img.alt = 'Image';
      }
      
      // Convert to modern formats if needed
      // (This would be handled by build process in production)
    });
  }

  public optimizeFonts(): void {
    // Find all font face declarations and optimize
    const styleSheets = document.styleSheets;
    
    for (let i = 0; i < styleSheets.length; i++) {
      try {
        const rules = styleSheets[i].cssRules;
        for (let j = 0; j < rules.length; j++) {
          if (rules[j] instanceof CSSFontFaceRule) {
            const fontFaceRule = rules[j] as CSSFontFaceRule;
            
            // Add display: swap if not present
            if (!fontFaceRule.style.fontDisplay) {
              fontFaceRule.style.fontDisplay = 'swap';
            }
            
            // Preload woff2 fonts
            const src = fontFaceRule.style.getPropertyValue('src');
            if (src && src.includes('.woff2')) {
              const urlMatch = src.match(/url\("?(.*?)"?\)/);
              if (urlMatch && urlMatch[1]) {
                this.preloadResource(urlMatch[1], 'font', { type: 'font/woff2', crossorigin: true });
              }
            }
          }
        }
      } catch (error) {
        console.warn('Could not access stylesheet rules:', error);
      }
    }
  }

  public optimizeCriticalCSS(): void {
    // In a real implementation, this would extract and inline critical CSS
    // For this migration, we'll focus on other optimizations
    if (this.options.debug) {
      console.log('Critical CSS optimization would be handled by build process');
    }
  }

  public getPerformanceMetrics(): Promise<PerformanceMetrics> {
    return new Promise((resolve) => {
      // Wait for page to be fully loaded
      if (document.readyState === 'complete') {
        this.collectMetrics(resolve);
      } else {
        window.addEventListener('load', () => this.collectMetrics(resolve));
      }
    });
  }

  private collectMetrics(resolve: (value: PerformanceMetrics) => void): void {
    const [lcpEntry] = performance.getEntriesByName('largest-contentful-paint');
    const [fcpEntry] = performance.getEntriesByName('first-contentful-paint');
    
    const metrics: PerformanceMetrics = {
      fcp: fcpEntry ? fcpEntry.startTime : 0,
      lcp: lcpEntry ? lcpEntry.startTime : 0,
      cls: 0, // Would be calculated from layout shifts
      tbt: 0, // Would be calculated from long tasks
      tti: 0, // Would be calculated from performance timeline
      resourceCount: performance.getEntriesByType('resource').length,
      domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      pageLoad: performance.timing.loadEventEnd - performance.timing.navigationStart,
      memory: performance.memory ? performance.memory.usedJSHeapSize : 0
    };
    
    resolve(metrics);
  }

  public destroy(): void {
    if (this.lazyLoadObserver) {
      this.lazyLoadObserver.disconnect();
      this.lazyLoadObserver = null;
    }
  }

  public getOptions(): PerformanceServiceOptions {
    return this.options;
  }

  public setDebug(debug: boolean): void {
    this.options.debug = debug;
  }
}

// Initialize performance service
const performanceService = new PerformanceService();

// Export for other modules
if (typeof window !== 'undefined') {
  (window as { performanceService?: PerformanceService }).performanceService = performanceService;
}

export { PerformanceService, performanceService };

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  tbt: number; // Total Blocking Time
  tti: number; // Time to Interactive
  resourceCount: number; // Number of resources loaded
  domContentLoaded: number; // DOMContentLoaded time
  pageLoad: number; // Full page load time
  memory: number; // Memory usage
}

export type { PerformanceServiceOptions };