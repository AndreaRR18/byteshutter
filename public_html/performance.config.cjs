// Performance Optimization Configuration
// Centralized configuration for all performance optimizations

module.exports = {
  // Image Optimization
  images: {
    quality: 85,
    formats: ['webp', 'avif', 'jpeg'],
    widths: [400, 800, 1200, 1600],
    lazyLoading: true,
    placeholder: true,
    compression: {
      webp: { quality: 80 },
      avif: { quality: 75 },
      jpeg: { quality: 85 }
    }
  },
  
  // CSS Optimization
  css: {
    minify: true,
    critical: true,
    inline: false,
    purge: true,
    autoprefixer: {
      browsers: ['last 2 versions', '> 1%', 'not dead']
    }
  },
  
  // JavaScript Optimization
  javascript: {
    minify: true,
    bundle: true,
    treeShaking: true,
    codeSplitting: true,
    defer: true,
    preload: true
  },
  
  // HTML Optimization
  html: {
    minify: true,
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    useShortDoctype: true
  },
  
  // Caching Strategy
  caching: {
    staticAssets: {
      maxAge: '1y',
      immutable: true
    },
    serviceWorker: {
      enabled: true,
      cacheFirst: ['images', 'fonts', 'css', 'js'],
      networkFirst: ['html', 'api']
    },
    preload: ['critical-css', 'critical-js', 'fonts']
  },
  
  // Performance Budgets
  budgets: {
    javascript: {
      maxSize: '200KB',
      warningSize: '150KB'
    },
    css: {
      maxSize: '100KB',
      warningSize: '80KB'
    },
    images: {
      maxSize: '500KB',
      warningSize: '300KB'
    },
    total: {
      maxSize: '1MB',
      warningSize: '800KB'
    }
  },
  
  // Critical CSS Configuration
  criticalCss: {
    extract: true,
    inline: true,
    minify: true,
    dimensions: [
      { width: 1300, height: 900 },
      { width: 375, height: 667 }
    ]
  },
  
  // Font Optimization
  fonts: {
    preload: true,
    display: 'swap',
    subsets: ['latin', 'latin-ext'],
    formats: ['woff2', 'woff']
  },
  
  // Lazy Loading
  lazyLoading: {
    images: true,
    iframes: true,
    videos: true,
    threshold: 100,
    rootMargin: '100px'
  },
  
  // Preloading Strategy
  preloading: {
    critical: ['fonts', 'critical-css'],
    highPriority: ['main-js', 'main-css'],
    lowPriority: ['lazy-images', 'non-critical-js']
  },
  
  // Performance Monitoring
  monitoring: {
    lighthouse: {
      thresholds: {
        performance: 90,
        accessibility: 95,
        bestPractices: 90,
        seo: 90,
        pwa: 50
      }
    },
    webVitals: {
      fcp: 1000,  // First Contentful Paint < 1s
      lcp: 2500,  // Largest Contentful Paint < 2.5s
      cls: 0.1,   // Cumulative Layout Shift < 0.1
      tbt: 200,   // Total Blocking Time < 200ms
      tti: 3000   // Time to Interactive < 3s
    }
  }
};