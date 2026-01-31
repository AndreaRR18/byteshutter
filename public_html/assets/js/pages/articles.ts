// Articles Page Script
// Handles articles page specific functionality

import { dataService } from '../services/dataService';

interface ArticlesPageOptions {
  debug?: boolean;
}

class ArticlesPage {
  private options: ArticlesPageOptions;

  constructor(options: ArticlesPageOptions = {}) {
    this.options = {
      debug: false,
      ...options
    };
    
    this.init();
  }

  private init(): void {
    if (this.options.debug) {
      console.log('ArticlesPage initialized');
    }
    
    this.loadArticles();
    
    // Dispatch page load event
    window.dispatchEvent(new CustomEvent('page-load', {
      detail: { pageName: 'articles' }
    }));
  }

  private async loadArticles(): Promise<void> {
    try {
      const articlesGrid = document.getElementById('articles-grid');
      
      if (!articlesGrid) {
        console.warn('Articles grid not found');
        return;
      }
      
      // Show loading state
      articlesGrid.innerHTML = '<div class="loading">Loading articles...</div>';
      
      // Fetch articles data
      const articlesData = await dataService.fetchArticles();
      
      if (articlesData.articles.length === 0) {
        articlesGrid.innerHTML = '<p class="no-articles">No articles found.</p>';
        return;
      }
      
      // Clear loading state
      articlesGrid.innerHTML = '';
      
      // Create article cards
      articlesData.articles.forEach(article => {
        const articleCard = document.createElement('div');
        articleCard.className = 'article-card';
        
        const tagsHTML = article.tags.map(tag => 
          `<span class="tag">${tag}</span>`
        ).join('');
        
        articleCard.innerHTML = `
          <div class="article-header">
            <h2 class="article-title">
              <a href="/articles/${article.slug}" class="article-link">
                ${article.title}
              </a>
            </h2>
            <div class="article-meta">
              <span class="article-date">${this.formatDate(article.date)}</span>
              <span class="article-reading-time">${article.readingTime} min read</span>
            </div>
          </div>
          <div class="article-excerpt">
            <p>${article.excerpt}</p>
          </div>
          <div class="article-tags">
            ${tagsHTML}
          </div>
        `;
        
        // Add click handler for navigation
        articleCard.querySelector('.article-link')?.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.router) {
            window.router.navigate(`/articles/${article.slug}`);
          }
        });
        
        articlesGrid.appendChild(articleCard);
      });
      
      if (this.options.debug) {
        console.log('Articles loaded successfully');
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      
      const articlesGrid = document.getElementById('articles-grid');
      if (articlesGrid) {
        articlesGrid.innerHTML = `
          <div class="error">
            <h2>Error Loading Articles</h2>
            <p>Sorry, there was an error loading the articles.</p>
            <button onclick="window.location.reload()" class="btn">Retry</button>
          </div>
        `;
      }
    }
  }

  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }

  public destroy(): void {
    // Clean up event listeners
    const articleLinks = document.querySelectorAll('.article-link');
    
    articleLinks.forEach(link => {
      link.removeEventListener('click', this.loadArticles);
    });
  }

  public getOptions(): ArticlesPageOptions {
    return this.options;
  }
}

// Initialize articles page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ArticlesPage({ debug: import.meta.env.DEV });
});

// Export for testing
export { ArticlesPage };

export type { ArticlesPageOptions };