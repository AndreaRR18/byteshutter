// Home Page Script
// Handles home page specific functionality

import { dataService } from '../../services/dataService';

interface HomePageOptions {
  debug?: boolean;
}

class HomePage {
  private options: HomePageOptions;

  constructor(options: HomePageOptions = {}) {
    this.options = {
      debug: false,
      ...options
    };
    
    this.init();
  }

  private init(): void {
    if (this.options.debug) {
      console.log('HomePage initialized');
    }
    
    this.setupEventListeners();
    this.loadDynamicContent();
    
    // Dispatch page load event
    window.dispatchEvent(new CustomEvent('page-load', {
      detail: { pageName: 'home' }
    }));
  }

  private setupEventListeners(): void {
    // Set up any home page specific event listeners
    const ctaButtons = document.querySelectorAll('.hero-actions .btn');
    
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const href = target.getAttribute('href');
        
        if (href && window.router) {
          e.preventDefault();
          window.router.navigate(href);
        }
      });
    });
  }

  private async loadDynamicContent(): Promise<void> {
    try {
      // Load recently read books data
      await this.loadRecentlyReadBooks();
      
      // Load interesting articles data
      await this.loadInterestingArticles();
      
      if (this.options.debug) {
        console.log('Home page dynamic content loaded');
      }
    } catch (error) {
      console.error('Error loading home page content:', error);
    }
  }

  private async loadRecentlyReadBooks(): Promise<void> {
    try {
      // Fetch books data
      const booksData = await dataService.fetchBooks();
      const booksGrid = document.querySelector('.books-grid');
      
      if (booksGrid && booksData.recentlyRead.length > 0) {
        // Clear existing content
        booksGrid.innerHTML = '';
        
        // Create book cards from data
        booksData.recentlyRead.forEach(book => {
          const bookCard = document.createElement('div');
          bookCard.className = 'book-card';
          
          bookCard.innerHTML = `
            <div class="book-cover">
              <img src="${book.image}" alt="${book.title}" class="book-image" loading="lazy">
            </div>
            <div class="book-info">
              <h3 class="book-title">${book.title}</h3>
              <p class="book-author">by ${book.author}</p>
            </div>
          `;
          
          booksGrid.appendChild(bookCard);
        });
        
        // Add fade-in animation
        booksGrid.classList.add('fade-in');
      }
    } catch (error) {
      console.error('Error loading recently read books:', error);
    }
  }

  private async loadInterestingArticles(): Promise<void> {
    try {
      // In a real implementation, this would fetch from an API
      const articlesList = document.querySelector('.articles-list');
      
      if (articlesList) {
        // Add fade-in animation
        articlesList.classList.add('fade-in');
      }
    } catch (error) {
      console.error('Error loading interesting articles:', error);
    }
  }

  public destroy(): void {
    // Clean up event listeners
    const ctaButtons = document.querySelectorAll('.hero-actions .btn');
    
    ctaButtons.forEach(button => {
      button.removeEventListener('click', this.setupEventListeners);
    });
  }

  public getOptions(): HomePageOptions {
    return this.options;
  }
}

// Initialize home page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new HomePage({ debug: import.meta.env.DEV });
});

// Export for testing
export { HomePage };

export type { HomePageOptions };