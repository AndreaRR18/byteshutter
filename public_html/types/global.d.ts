// Global Type Declarations for ByteShutter HTML/CSS Project

declare global {
  interface Window {
    router: import('../assets/js/router').Router;
    themeManager: import('../assets/js/theme').ThemeManager;
    app: import('../assets/js/main').App;
    performanceService: import('../assets/js/services/performanceService').PerformanceService;
    accessibilityService: import('../assets/js/services/accessibilityService').AccessibilityService;
    seoService: import('../assets/js/services/seoService').SEOService;
  }

  interface HTMLElement {
    closest(selector: string): HTMLElement | null;
    matches(selector: string): boolean;
  }

  interface Document {
    querySelectorAll(selector: string): NodeListOf<HTMLElement>;
  }

  interface CustomEvent<T = any> extends Event {
    detail: T;
    initCustomEvent(type: string, bubbles?: boolean, cancelable?: boolean, detail?: T): void;
  }

  interface CustomEventInit<T = any> extends EventInit {
    detail?: T;
  }

  // Theme Change Event
  interface ThemeChangeEventDetail {
    theme: 'light' | 'dark';
  }

  interface ThemeChangeEvent extends CustomEvent<ThemeChangeEventDetail> {}

  // Route Change Event
  interface RouteChangeEventDetail {
    path: string;
    route: import('../assets/js/router').Route;
  }

  interface RouteChangeEvent extends CustomEvent<RouteChangeEventDetail> {}

  // Page Load Event
  interface PageLoadEventDetail {
    pageName: string;
    data: Record<string, any>;
  }

  interface PageLoadEvent extends CustomEvent<PageLoadEventDetail> {}

  // Environment Variables
  interface ImportMeta {
    env: {
      DEV: boolean;
      PROD: boolean;
      BASE_URL: string;
    };
  }

  // Data Attributes
  interface HTMLElement {
    dataset: DOMStringMap & {
      themeToggle?: string;
      src?: string;
      [key: string]: string | undefined;
    };
  }

  // Component Interfaces
  interface ComponentOptions {
    element?: HTMLElement | string;
    data?: Record<string, any>;
    debug?: boolean;
  }

  interface Component {
    init(): void;
    destroy(): void;
    update(data: Record<string, any>): void;
  }

  // Utility Types
  type Nullable<T> = T | null;
  type Optional<T> = T | undefined;
  type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R> ? R : any;

  // API Response Types
  interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    error?: string;
  }

  interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }

  // Book Types
  interface Book {
    id: string;
    title: string;
    author: string;
    image: string;
    description: string;
    publishedDate: string;
    categories: string[];
  }

  // Article Types
  interface Article {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    tags: string[];
    readingTime: number;
    featuredImage?: string;
  }

  // Event Types
  interface AppEventMap {
    'theme-change': ThemeChangeEvent;
    'route-change': RouteChangeEvent;
    'page-load': PageLoadEvent;
    'component-ready': CustomEvent<{ component: string }>;
    'data-loaded': CustomEvent<{ type: string; data: any }>;
  }

  // Add event listener with type safety
  interface Window {
    addEventListener<K extends keyof AppEventMap>(
      type: K,
      listener: (event: AppEventMap[K]) => void,
      options?: boolean | AddEventListenerOptions
    ): void;
    
    removeEventListener<K extends keyof AppEventMap>(
      type: K,
      listener: (event: AppEventMap[K]) => void,
      options?: boolean | EventListenerOptions
    ): void;
    
    dispatchEvent<K extends keyof AppEventMap>(event: AppEventMap[K]): boolean;
  }

  // Error Handling
  interface AppError extends Error {
    code?: string;
    status?: number;
    details?: Record<string, any>;
  }

  // Logger Interface
  interface Logger {
    log(message: string, data?: any): void;
    info(message: string, data?: any): void;
    warn(message: string, data?: any): void;
    error(message: string, error?: Error, data?: any): void;
    debug(message: string, data?: any): void;
  }

  // Storage Interface
  interface StorageService {
    getItem<T>(key: string): T | null;
    setItem<T>(key: string, value: T): void;
    removeItem(key: string): void;
    clear(): void;
  }

  // Cache Interface
  interface CacheService {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
  }
  
  // Performance Metrics Interface
  interface PerformanceMetrics {
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

  // Extended Browser API Types
  interface PerformanceEntry {
    hadRecentInput?: boolean;
    value?: number;
    processingStart?: number;
  }
  
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
  
  interface CSSStyleDeclaration {
    fontDisplay?: string;
  }
  
  interface HTMLElement {
    loading?: string;
  }
  
  // Accessibility Report Interface
  interface AccessibilityReport {
    issues: string[];
    warnings: string[];
    passed: string[];
  }
  
  // SEO Report Interface
  interface SEOReport {
    issues: string[];
    warnings: string[];
    passed: string[];
  }
}

export {};