// Data Loading Service
// Handles all data fetching and caching

interface DataServiceOptions {
  baseUrl?: string;
  cacheTTL?: number;
  debug?: boolean;
}

class DataService {
  private options: DataServiceOptions;
  private cache: Map<string, { data: unknown; timestamp: number }>;

  constructor(options: DataServiceOptions = {}) {
    this.options = {
      baseUrl: '/data',
      cacheTTL: 300000, // 5 minutes
      debug: false,
      ...options
    };
    
    this.cache = new Map();
  }

  private log(message: string, data?: unknown): void {
    if (this.options.debug) {
      console.log(`[DataService] ${message}`, data || '');
    }
  }

  private getCacheKey(url: string): string {
    return `${this.options.baseUrl}${url}`;
  }

  private isCacheValid(cacheKey: string): boolean {
    if (!this.cache.has(cacheKey)) return false;
    
    const cachedItem = this.cache.get(cacheKey);
    if (!cachedItem) return false;
    
    const age = Date.now() - cachedItem.timestamp;
    return age < (this.options.cacheTTL || 300000);
  }

  public async fetchData<T>(endpoint: string): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint);
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      const cachedItem = this.cache.get(cacheKey);
      this.log(`Returning cached data for ${endpoint}`);
      return cachedItem?.data as T;
    }
    
    try {
      this.log(`Fetching data from ${endpoint}`);
      
      const response = await fetch(`${this.options.baseUrl}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      this.log(`Successfully fetched and cached data for ${endpoint}`);
      
      return data as T;
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      
      // Return cached data if available, even if stale
      if (this.cache.has(cacheKey)) {
        const cachedItem = this.cache.get(cacheKey);
        this.log(`Returning stale cached data for ${endpoint} due to fetch error`);
        return cachedItem?.data as T;
      }
      
      throw error;
    }
  }

  public async fetchBooks(): Promise<{ currentlyReading: Book; recentlyRead: Book[] }> {
    return this.fetchData<{ currentlyReading: Book; recentlyRead: Book[] }>('/books.json');
  }

  public async fetchArticles(): Promise<{ articles: Article[] }> {
    return this.fetchData<{ articles: Article[] }>('/articles.json');
  }

  public async fetchArticle(slug: string): Promise<Article | null> {
    try {
      const articlesData = await this.fetchArticles();
      const article = articlesData.articles.find(article => article.slug === slug);
      
      if (!article) {
        console.warn(`Article with slug ${slug} not found`);
        return null;
      }
      
      return article;
    } catch (error) {
      console.error(`Error fetching article ${slug}:`, error);
      return null;
    }
  }

  public clearCache(): void {
    this.cache.clear();
    this.log('Cache cleared');
  }

  public getCacheSize(): number {
    return this.cache.size;
  }

  public setDebug(debug: boolean): void {
    this.options.debug = debug;
  }

  public getOptions(): DataServiceOptions {
    return this.options;
  }
}

// Initialize data service
const dataService = new DataService();

// Export for other modules
if (typeof window !== 'undefined') {
  (window as { dataService?: DataService }).dataService = dataService;
}

export { DataService, dataService };

export type { DataServiceOptions };