// Data Service Tests
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { dataService } from '../assets/js/services/dataService';
import '../tests/testSetup';

describe('DataService', () => {
  const testData = {
    test: 'data'
  };
  
  beforeEach(() => {
    // Mock fetch
    global.testUtils.mockFetch(testData);
    
    // Clear cache
    dataService.clearCache();
  });
  
  afterEach(() => {
    // Restore fetch
    global.testUtils.restoreFetch();
    
    // Clear cache
    dataService.clearCache();
  });
  
  it('should fetch data from endpoint', async () => {
    const data = await dataService.fetchData('/test.json');
    expect(data).toEqual(testData);
  });
  
  it('should cache fetched data', async () => {
    // First fetch
    await dataService.fetchData('/test.json');
    expect(dataService.getCacheSize()).toBe(1);
    
    // Second fetch should use cache
    const cachedData = await dataService.fetchData('/test.json');
    expect(cachedData).toEqual(testData);
    expect(dataService.getCacheSize()).toBe(1); // Should not increase
  });
  
  it('should handle fetch errors gracefully', async () => {
    // Mock failed fetch
    global.fetch = async () => ({
      ok: false,
      status: 404
    }) as Response;
    
    try {
      await dataService.fetchData('/nonexistent.json');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  
  it('should return cached data on fetch failure', async () => {
    // First, populate cache
    await dataService.fetchData('/test.json');
    
    // Then mock failed fetch
    global.fetch = async () => ({
      ok: false,
      status: 500
    }) as Response;
    
    // Should return cached data
    const cachedData = await dataService.fetchData('/test.json');
    expect(cachedData).toEqual(testData);
  });
  
  it('should clear cache when requested', () => {
    dataService.clearCache();
    expect(dataService.getCacheSize()).toBe(0);
  });
  
  it('should handle books data fetching', async () => {
    const booksData = {
      currentlyReading: {
        id: 'test-book',
        title: 'Test Book'
      },
      recentlyRead: []
    };
    
    global.testUtils.mockFetch(booksData);
    
    const data = await dataService.fetchBooks();
    expect(data).toEqual(booksData);
  });
  
  it('should handle articles data fetching', async () => {
    const articlesData = {
      articles: [
        {
          id: 'test-article',
          slug: 'test-article',
          title: 'Test Article'
        }
      ]
    };
    
    global.testUtils.mockFetch(articlesData);
    
    const data = await dataService.fetchArticles();
    expect(data).toEqual(articlesData);
  });
  
  it('should find article by slug', async () => {
    const articlesData = {
      articles: [
        {
          id: 'test-article',
          slug: 'test-article',
          title: 'Test Article'
        }
      ]
    };
    
    global.testUtils.mockFetch(articlesData);
    
    const article = await dataService.fetchArticle('test-article');
    expect(article).toEqual(articlesData.articles[0]);
  });
  
  it('should return null for non-existent article', async () => {
    global.testUtils.mockFetch({ articles: [] });
    
    const article = await dataService.fetchArticle('nonexistent');
    expect(article).toBeNull();
  });
});