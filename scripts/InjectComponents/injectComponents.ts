#!/usr/bin/env node

/**
 * Component Injection Script
 * Replaces placeholders in template HTML files with shared component content
 * and writes the final HTML to the root directory.
 */

import * as fs from 'fs';
import * as path from 'path';

interface PageConfig {
  title: string;
  description: string;
  keywords: string;
  ogType: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  twitterTitle: string;
  activeNav: 'none' | 'articles' | 'about';
}

const config: Record<string, PageConfig> = {
  'index.html': {
    title: 'ByteShutter',
    description: 'ByteShutter - Personal blog about web development, iOS development, Swift, SwiftUI, and photography by Andrea Rinaldi',
    keywords: 'web development, iOS, Swift, SwiftUI, photography, programming blog',
    ogType: 'website',
    ogTitle: 'ByteShutter - Tech & Photography Blog',
    ogDescription: 'Articles about web development, iOS development, Swift, and photography',
    ogUrl: 'https://andrearr18.github.io/byteshutter/',
    twitterTitle: 'ByteShutter',
    activeNav: 'none'
  },
  'about.html': {
    title: 'About - ByteShutter',
    description: 'About Andrea Rinaldi - software engineer, mobile developer, photography enthusiast',
    keywords: 'Andrea Rinaldi, iOS developer, Swift, SwiftUI, mobile engineer',
    ogType: 'website',
    ogTitle: 'About - ByteShutter',
    ogDescription: 'About Andrea Rinaldi - software engineer, mobile developer, photography enthusiast',
    ogUrl: 'https://andrearr18.github.io/byteshutter/about.html',
    twitterTitle: 'About - ByteShutter',
    activeNav: 'about'
  },
  'articles.html': {
    title: 'Articles - ByteShutter',
    description: 'Articles about web development, iOS development, Swift, SwiftUI, and more by Andrea Rinaldi',
    keywords: 'web development, iOS, Swift, SwiftUI, programming articles',
    ogType: 'website',
    ogTitle: 'Articles - ByteShutter',
    ogDescription: 'Articles about web development, iOS development, Swift, SwiftUI, and more',
    ogUrl: 'https://andrearr18.github.io/byteshutter/articles.html',
    twitterTitle: 'Articles - ByteShutter',
    activeNav: 'articles'
  },
  'article.html': {
    title: 'ByteShutter',
    description: 'ByteShutter - Article',
    keywords: 'web development, iOS, Swift, SwiftUI, photography, programming blog',
    ogType: 'article',
    ogTitle: 'ByteShutter',
    ogDescription: 'ByteShutter - Article',
    ogUrl: 'https://andrearr18.github.io/byteshutter/',
    twitterTitle: 'ByteShutter',
    activeNav: 'articles'
  }
};

function loadComponent(filePath: string): string {
  const absolutePath = path.resolve('.', filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Component file not found: ${absolutePath}`);
  }
  return fs.readFileSync(absolutePath, 'utf-8');
}

function replaceTemplateVariables(content: string, replacements: Record<string, string>): string {
  for (const [key, value] of Object.entries(replacements)) {
    const template = `{{${key}}}`;
    content = content.replace(new RegExp(template, 'g'), value);
  }
  return content;
}

function processPage(pageName: string): string {
  const pageConfig = config[pageName];
  
  if (!pageConfig) {
    throw new Error(`No configuration found for page: ${pageName}`);
  }

  // Load template
  const templatePath = path.resolve('.', 'templates', pageName);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found: ${templatePath}`);
  }
  let htmlContent = fs.readFileSync(templatePath, 'utf-8');

  // Load components
  const headBase = loadComponent('components/head-base.html');
  const header = loadComponent('components/header.html');
  const footer = loadComponent('components/footer.html');

  // Prepare template variables for head
  const headReplacements = {
    description: pageConfig.description,
    keywords: pageConfig.keywords,
    ogType: pageConfig.ogType,
    ogTitle: pageConfig.ogTitle,
    ogDescription: pageConfig.ogDescription,
    ogUrl: pageConfig.ogUrl,
    twitterTitle: pageConfig.twitterTitle
  };

  const processedHead = replaceTemplateVariables(headBase, headReplacements);

  // Prepare template variables for header
  const headerReplacements = {
    articlesActive: pageConfig.activeNav === 'articles' ? ' active' : '',
    aboutActive: pageConfig.activeNav === 'about' ? ' active' : ''
  };

  const processedHeader = replaceTemplateVariables(header, headerReplacements);

  // Replace placeholders in the template
  htmlContent = htmlContent
    .replace('<!-- HEAD -->\n  <title><!-- TITLE --></title>', `<title>${pageConfig.title}</title>\n  ${processedHead.trim()}`)
    .replace('<!-- HEADER -->', processedHeader)
    .replace('<!-- FOOTER -->', footer);

  return htmlContent;
}

// Main function
function main() {
  const pages = ['index.html', 'about.html', 'articles.html', 'article.html'];
  
  // First, copy templates to root if they don't exist
  for (const pageName of pages) {
    const templatePath = path.resolve('.', 'templates', pageName);
    const outputPath = path.resolve('.', pageName);
    
    if (!fs.existsSync(outputPath)) {
      if (fs.existsSync(templatePath)) {
        fs.copyFileSync(templatePath, outputPath);
        console.log(`  Copied template: ${pageName}`);
      }
    }
  }
  
  for (const pageName of pages) {
    try {
      console.log(`Processing: ${pageName}`);
      const processed = processPage(pageName);
      
      // Write to root directory
      const outputPath = path.resolve('.', pageName);
      fs.writeFileSync(outputPath, processed);
      console.log(`  Generated: ${pageName}`);
    } catch (error) {
      console.error(`  Error processing ${pageName}:`, error instanceof Error ? error.message : error);
    }
  }

  console.log('\nComponent injection complete!');
}

main();
