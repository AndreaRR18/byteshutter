#!/usr/bin/env node

/**
 * Performance Optimization Script
 * This script performs various performance optimizations on the built assets
 */

import fs from 'fs';
import path from 'path';
import { minify } from 'terser';
import CleanCSS from 'clean-css';
import htmlMinifier from 'html-minifier';
import sharp from 'sharp';
import config from '../performance.config.js';

interface PerformanceConfig {
  imageQuality: number;
  removeConsoleLogs: boolean;
  // Add other config properties as needed
  [key: string]: unknown;
}

class PerformanceOptimizer {
  private config: PerformanceConfig;
  private distDir: string;
  private publicDir: string;

  constructor() {
    this.config = config;
    this.distDir = path.join(__dirname, '..', 'dist');
    this.publicDir = path.join(__dirname, '..', 'public');
  }

  async run() {
    console.log('🚀 Starting performance optimization...');
    
    try {
      // Ensure dist directory exists
      if (!fs.existsSync(this.distDir)) {
        fs.mkdirSync(this.distDir, { recursive: true });
      }
      
      // Copy public assets to dist
      await this.copyPublicAssets();
      
      // Optimize HTML files
      await this.optimizeHTML();
      
      // Optimize CSS files
      await this.optimizeCSS();
      
      // Optimize JavaScript files
      await this.optimizeJavaScript();
      
      // Optimize images
      await this.optimizeImages();
      
      // Optimize fonts
      await this.optimizeFonts();
      
      // Generate critical CSS
      await this.generateCriticalCSS();
      
      // Generate performance report
      await this.generatePerformanceReport();
      
      console.log('✅ Performance optimization completed successfully!');
      console.log('📊 See performance-report.json for detailed results.');
      
    } catch (error) {
      console.error('❌ Performance optimization failed:', error);
      process.exit(1);
    }
  }

  private async copyPublicAssets() {
    const publicAssets = ['favicon.svg', 'robots.txt', 'manifest.json'];
    
    for (const asset of publicAssets) {
      const srcPath = path.join(this.publicDir, asset);
      const destPath = path.join(this.distDir, asset);
      
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`📄 Copied ${asset}`);
      }
    }
  }

  private async optimizeHTML() {
    const htmlFiles = this.findFiles(this.publicDir, '.html');
    
    for (const file of htmlFiles) {
      const html = fs.readFileSync(file, 'utf8');
      const minified = htmlMinifier.minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        keepClosingSlash: true
      });
      
      const relativePath = path.relative(this.publicDir, file);
      const destPath = path.join(this.distDir, relativePath);
      
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, minified);
      console.log(`📄 Optimized HTML: ${relativePath}`);
    }
  }

  private async optimizeCSS() {
    const cssFiles = this.findFiles(this.publicDir, '.css');
    const cleanCSS = new CleanCSS({
      level: 2,
      format: 'beautify'
    });
    
    for (const file of cssFiles) {
      const css = fs.readFileSync(file, 'utf8');
      const minified = cleanCSS.minify(css);
      
      const relativePath = path.relative(this.publicDir, file);
      const destPath = path.join(this.distDir, relativePath);
      
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, minified.styles);
      console.log(`📄 Optimized CSS: ${relativePath}`);
    }
  }

  private async optimizeJavaScript() {
    const jsFiles = this.findFiles(this.distDir, '.js');
    
    for (const file of jsFiles) {
      const js = fs.readFileSync(file, 'utf8');
      const result = await minify(js, {
        compress: {
          dead_code: true,
          drop_console: this.config.removeConsoleLogs,
          drop_debugger: true
        },
        mangle: true,
        format: {
          beautify: false,
          comments: false
        }
      });
      
      if (result.code) {
        fs.writeFileSync(file, result.code);
        console.log(`📄 Optimized JS: ${path.relative(this.distDir, file)}`);
      }
    }
  }

  private async optimizeImages() {
    const imageFiles = this.findFiles(this.publicDir, /\.(jpg|jpeg|png|webp|avif)$/i);
    
    for (const file of imageFiles) {
      const ext = path.extname(file).toLowerCase();
      const relativePath = path.relative(this.publicDir, file);
      const destPath = path.join(this.distDir, relativePath);
      
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      
      if (ext === '.jpg' || ext === '.jpeg') {
        await sharp(file)
          .jpeg({ quality: this.config.imageQuality })
          .toFile(destPath);
      } else if (ext === '.png') {
        await sharp(file)
          .png({ quality: this.config.imageQuality })
          .toFile(destPath);
      } else if (ext === '.webp') {
        await sharp(file)
          .webp({ quality: this.config.imageQuality })
          .toFile(destPath);
      } else if (ext === '.avif') {
        await sharp(file)
          .avif({ quality: this.config.imageQuality })
          .toFile(destPath);
      }
      
      console.log(`📄 Optimized image: ${relativePath}`);
    }
  }

  private async optimizeFonts() {
    const fontFiles = this.findFiles(this.publicDir, /\.(woff|woff2|ttf|otf|eot)$/i);
    
    for (const file of fontFiles) {
      const relativePath = path.relative(this.publicDir, file);
      const destPath = path.join(this.distDir, relativePath);
      
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(file, destPath);
      console.log(`📄 Copied font: ${relativePath}`);
    }
  }

  private async generateCriticalCSS() {
    const htmlFiles = this.findFiles(this.distDir, '.html');
    
    for (const htmlFile of htmlFiles) {
      const html = fs.readFileSync(htmlFile, 'utf8');
      const criticalCSS = this.extractCriticalCSS(html);
      
      if (criticalCSS) {
        const cssPath = htmlFile.replace('.html', '.critical.css');
        fs.writeFileSync(cssPath, criticalCSS);
        console.log(`📄 Generated critical CSS: ${path.basename(cssPath)}`);
      }
    }
  }

  private extractCriticalCSS(html) {
    // Simplified critical CSS extraction
    // In production, use a proper tool like Penthouse
    
    const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (!styleMatches) return '';
    
    let criticalCSS = '';
    
    for (const match of styleMatches) {
      const styleContent = match.replace(/<style[^>]*>/, '').replace(/<\/style>/, '');
      criticalCSS += styleContent + '\n';
    }
    
    return criticalCSS.trim();
  }

  private findFiles(directory, pattern) {
    let files = [];
    
    if (!fs.existsSync(directory)) {
      return files;
    }
    
    const items = fs.readdirSync(directory);
    
    for (const item of items) {
      const fullPath = path.join(directory, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(this.findFiles(fullPath, pattern));
      } else if (typeof pattern === 'string' && item.endsWith(pattern)) {
        files.push(fullPath);
      } else if (pattern instanceof RegExp && pattern.test(item)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  private formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private async generatePerformanceReport() {
    const report = {
      timestamp: new Date().toISOString(),
      optimizations: {
        html: {
          files: this.findFiles(this.distDir, '.html').length,
          totalSize: this.calculateTotalSize(this.findFiles(this.distDir, '.html'))
        },
        css: {
          files: this.findFiles(this.distDir, '.css').length,
          totalSize: this.calculateTotalSize(this.findFiles(this.distDir, '.css'))
        },
        js: {
          files: this.findFiles(this.distDir, '.js').length,
          totalSize: this.calculateTotalSize(this.findFiles(this.distDir, '.js'))
        },
        images: {
          files: this.findFiles(this.distDir, /\.(jpg|jpeg|png|webp|avif)$/i).length,
          totalSize: this.calculateTotalSize(this.findFiles(this.distDir, /\.(jpg|jpeg|png|webp|avif)$/i))
        },
        fonts: {
          files: this.findFiles(this.distDir, /\.(woff|woff2|ttf|otf|eot)$/i).length,
          totalSize: this.calculateTotalSize(this.findFiles(this.distDir, /\.(woff|woff2|ttf|otf|eot)$/i))
        }
      },
      savings: {
        // Calculate savings compared to original sizes
        // This would require comparing with original file sizes
      }
    };
    
    const reportPath = path.join(this.distDir, 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📊 Performance report generated');
  }

  private calculateTotalSize(files) {
    let totalSize = 0;
    
    for (const file of files) {
      if (fs.existsSync(file)) {
        totalSize += fs.statSync(file).size;
      }
    }
    
    return totalSize;
  }
}

// Run the optimizer if this script is executed directly
if (require.main === module) {
  const optimizer = new PerformanceOptimizer();
  optimizer.run();
}

export { PerformanceOptimizer };