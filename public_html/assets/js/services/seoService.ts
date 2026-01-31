// SEO Service
// Handles SEO optimization and metadata management

interface SEOServiceOptions {
  debug?: boolean;
  autoGenerate?: boolean;
}

class SEOService {
  private options: SEOServiceOptions;
  private defaultMeta: Record<string, string>;

  constructor(options: SEOServiceOptions = {}) {
    this.options = {
      debug: false,
      autoGenerate: true,
      ...options
    };
    
    this.defaultMeta = {
      description: 'ByteShutter - Exploring Web Development, iOS, and Photography',
      keywords: 'web development, iOS, Swift, SwiftUI, photography, programming blog',
      author: 'Andrea Rinaldi',
      'og:title': 'ByteShutter - Tech & Photography Blog',
      'og:description': 'Articles about web development, iOS development, Swift, and photography',
      'og:url': 'https://andrearr18.github.io/byteshutter/',
      'og:type': 'website',
      'twitter:card': 'summary_large_image',
      'twitter:title': 'ByteShutter',
      'twitter:description': 'Exploring Web Development, iOS, and Photography'
    };
    
    this.init();
  }

  private init(): void {
    if (this.options.debug) {
      console.log('SEOService initialized');
    }
    
    this.setupDefaultMetaTags();
    this.setupCanonicalURL();
    this.setupJSONLD();
    
    if (this.options.autoGenerate) {
      this.autoGenerateSEO();
    }
  }

  private setupDefaultMetaTags(): void {
    // Add default meta tags if not present
    Object.entries(this.defaultMeta).forEach(([name, content]) => {
      if (!document.querySelector(`meta[name="${name}"]`) &&
          !document.querySelector(`meta[property="${name}"]`)) {
        
        const meta = document.createElement('meta');
        
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    });
  }

  private setupCanonicalURL(): void {
    // Add canonical URL
    if (!document.querySelector('link[rel="canonical"]')) {
      const canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = this.defaultMeta['og:url'];
      document.head.appendChild(canonical);
    }
  }

  private setupJSONLD(): void {
    // Add JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "ByteShutter",
      "url": this.defaultMeta['og:url'],
      "description": this.defaultMeta.description,
      "author": {
        "@type": "Person",
        "name": this.defaultMeta.author
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://andrearr18.github.io/byteshutter/?s={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }

  public autoGenerateSEO(): void {
    if (this.options.debug) {
      console.log('Running SEO auto-generation...');
    }
    
    // Add Open Graph tags for current page
    this.generateOpenGraphTags();
    
    // Add Twitter Card tags
    this.generateTwitterCardTags();
    
    // Add article-specific tags if on article page
    this.generateArticleTags();
    
    // Add breadcrumb structured data
    this.generateBreadcrumbData();
  }

  private generateOpenGraphTags(): void {
    // Update OG tags based on current page
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    
    if (ogTitle && ogUrl) {
      const currentUrl = window.location.href;
      const currentTitle = document.title;
      
      ogTitle.setAttribute('content', currentTitle);
      ogUrl.setAttribute('content', currentUrl);
    }
  }

  private generateTwitterCardTags(): void {
    // Update Twitter Card tags based on current page
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    
    if (twitterTitle && twitterUrl) {
      const currentUrl = window.location.href;
      const currentTitle = document.title;
      
      twitterTitle.setAttribute('content', currentTitle);
      twitterUrl.setAttribute('content', currentUrl);
    }
  }

  private generateArticleTags(): void {
    // Check if we're on an article page
    if (window.location.pathname.includes('/articles/')) {
      const article = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": document.title,
        "image": "https://andrearr18.github.io/byteshutter/images/og-image.jpg",
        "author": {
          "@type": "Person",
          "name": this.defaultMeta.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "ByteShutter",
          "logo": {
            "@type": "ImageObject",
            "url": "https://andrearr18.github.io/byteshutter/favicon.svg"
          }
        },
        "datePublished": new Date().toISOString(),
        "dateModified": new Date().toISOString()
      };
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(article);
      document.head.appendChild(script);
    }
  }

  private generateBreadcrumbData(): void {
    // Generate breadcrumb structured data
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": []
    };
    
    // Add home breadcrumb
    breadcrumb.itemListElement.push({
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": this.defaultMeta['og:url']
    });
    
    // Add current page breadcrumb
    const pathParts = window.location.pathname.split('/').filter(p => p);
    let currentUrl = this.defaultMeta['og:url'];
    
    pathParts.forEach((part, index) => {
      currentUrl += part + '/';
      breadcrumb.itemListElement.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": part.replace(/-/g, ' '),
        "item": currentUrl
      });
    });
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(breadcrumb);
    document.head.appendChild(script);
  }

  public setPageTitle(title: string): void {
    document.title = title;
    
    // Update OG and Twitter titles
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    
    if (ogTitle) ogTitle.setAttribute('content', title);
    if (twitterTitle) twitterTitle.setAttribute('content', title);
  }

  public setPageDescription(description: string): void {
    const metaDesc = document.querySelector('meta[name="description"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    
    if (metaDesc) metaDesc.setAttribute('content', description);
    if (ogDesc) ogDesc.setAttribute('content', description);
    if (twitterDesc) twitterDesc.setAttribute('content', description);
  }

  public setPageURL(url: string): void {
    const canonical = document.querySelector('link[rel="canonical"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    
    if (canonical) canonical.setAttribute('href', url);
    if (ogUrl) ogUrl.setAttribute('content', url);
    if (twitterUrl) twitterUrl.setAttribute('content', url);
  }

  public addMetaTag(name: string, content: string, property?: boolean): void {
    const meta = document.createElement('meta');
    
    if (property) {
      meta.setAttribute('property', name);
    } else {
      meta.setAttribute('name', name);
    }
    
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }

  public generateSitemap(): string {
    // Generate sitemap XML
    const pages = [
      '',
      'about',
      'articles',
      // Add more pages as needed
    ];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    pages.forEach(page => {
      const url = this.defaultMeta['og:url'] + (page ? page : '');
      xml += '  <url>\n';
      xml += `    <loc>${url}</loc>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    
    return xml;
  }

  public generateRobotsTxt(): string {
    // Generate robots.txt
    let txt = '';
    txt += 'User-agent: *\n';
    txt += 'Disallow: /admin/\n';
    txt += 'Disallow: /private/\n';
    txt += 'Allow: /\n';
    txt += '\n';
    txt += `Sitemap: ${this.defaultMeta['og:url']}sitemap.xml`;
    
    return txt;
  }

  public checkSEO(): SEOReport {
    const report: SEOReport = {
      issues: [],
      warnings: [],
      passed: []
    };
    
    // Check for title tag
    if (document.title && document.title.trim() !== '') {
      report.passed.push('Title tag is present and not empty');
    } else {
      report.issues.push('Missing or empty title tag');
    }
    
    // Check for meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && metaDesc.getAttribute('content')?.trim()) {
      report.passed.push('Meta description is present');
    } else {
      report.issues.push('Missing meta description');
    }
    
    // Check for canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      report.passed.push('Canonical URL is set');
    } else {
      report.warnings.push('Canonical URL not found');
    }
    
    // Check for Open Graph tags
    const ogTags = document.querySelectorAll('meta[property^="og:"]');
    if (ogTags.length >= 3) {
      report.passed.push(`${ogTags.length} Open Graph tags found`);
    } else {
      report.warnings.push('Few Open Graph tags found');
    }
    
    // Check for Twitter Card tags
    const twitterTags = document.querySelectorAll('meta[name^="twitter:"]');
    if (twitterTags.length >= 2) {
      report.passed.push(`${twitterTags.length} Twitter Card tags found`);
    } else {
      report.warnings.push('Few Twitter Card tags found');
    }
    
    // Check for JSON-LD
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    if (jsonLd) {
      report.passed.push('JSON-LD structured data is present');
    } else {
      report.warnings.push('No JSON-LD structured data found');
    }
    
    // Check title length
    if (document.title.length > 0 && document.title.length <= 60) {
      report.passed.push('Title length is optimal (≤ 60 characters)');
    } else if (document.title.length > 60) {
      report.warnings.push('Title is longer than recommended (60 characters)');
    }
    
    // Check description length
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
    if (description && description.length > 50 && description.length <= 160) {
      report.passed.push('Description length is optimal (50-160 characters)');
    } else if (description && description.length > 160) {
      report.warnings.push('Description is longer than recommended (160 characters)');
    }
    
    return report;
  }

  public getOptions(): SEOServiceOptions {
    return this.options;
  }

  public setDebug(debug: boolean): void {
    this.options.debug = debug;
  }
}

// Initialize SEO service
const seoService = new SEOService();

// Export for other modules
if (typeof window !== 'undefined') {
  (window as any).seoService = seoService;
}

export { SEOService, seoService };

export interface SEOReport {
  issues: string[];
  warnings: string[];
  passed: string[];
}

export type { SEOServiceOptions };