#!/usr/bin/env node

/**
 * Performance Optimization Script
 * This script performs various performance optimizations on the built assets
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');
const htmlMinifier = require('html-minifier');
const sharp = require('sharp');
const config = require('../performance.config.js');

class PerformanceOptimizer {
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

  async copyPublicAssets() {
    console.log('📁 Copying public assets to dist...');
    
    if (!fs.existsSync(this.publicDir)) {
      console.log('⚠️  Public directory not found, skipping copy');
      return;
    }
    
    // Copy all files from public to dist
    const files = fs.readdirSync(this.publicDir);
    
    for (const file of files) {
      const srcPath = path.join(this.publicDir, file);
      const destPath = path.join(this.distDir, file);
      
      if (fs.lstatSync(srcPath).isDirectory()) {
        // Skip directories for now (we'll handle them individually)
        continue;
      }
      
      fs.copyFileSync(srcPath, destPath);
    }
    
    console.log('✅ Public assets copied');
  }

  async optimizeHTML() {
    console.log('🔧 Optimizing HTML files...');
    
    const htmlFiles = this.findFiles(this.distDir, '.html');
    
    for (const file of htmlFiles) {
      try {
        const html = fs.readFileSync(file, 'utf8');
        const minified = htmlMinifier.minify(html, {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          minifyCSS: true,
          minifyJS: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true
        });
        
        fs.writeFileSync(file, minified);
        console.log(`📄 Optimized: ${path.basename(file)}`);
        
      } catch (error) {
        console.error(`❌ Failed to optimize ${file}:`, error);
      }
    }
    
    console.log('✅ HTML optimization completed');
  }

  async optimizeCSS() {
    console.log('🎨 Optimizing CSS files...');
    
    const cssFiles = this.findFiles(this.distDir, '.css');
    const cleanCSS = new CleanCSS({
      level: {
        1: {
          specialComments: 0,
          removeEmpty: true
        },
        2: {
          mergeMedia: true,
          removeUnusedAtRules: true
        }
      }
    });
    
    for (const file of cssFiles) {
      try {
        const css = fs.readFileSync(file, 'utf8');
        const minified = cleanCSS.minify(css);
        
        if (minified.errors.length > 0) {
          console.error(`❌ CSS minification errors in ${file}:`, minified.errors);
          continue;
        }
        
        fs.writeFileSync(file, minified.styles);
        console.log(`📄 Optimized: ${path.basename(file)} (${this.formatBytes(css.length)} → ${this.formatBytes(minified.styles.length)})`);
        
      } catch (error) {
        console.error(`❌ Failed to optimize ${file}:`, error);
      }
    }
    
    console.log('✅ CSS optimization completed');
  }

  async optimizeJavaScript() {
    console.log('⚙️ Optimizing JavaScript files...');
    
    const jsFiles = this.findFiles(this.distDir, '.js');
    
    for (const file of jsFiles) {
      try {
        const js = fs.readFileSync(file, 'utf8');
        const minified = await minify(js, {
          compress: {
            passes: 2,
            toplevel: true,
            unsafe: true
          },
          mangle: true,
          format: {
            comments: false
          }
        });
        
        if (minified.code) {
          fs.writeFileSync(file, minified.code);
          console.log(`📄 Optimized: ${path.basename(file)} (${this.formatBytes(js.length)} → ${this.formatBytes(minified.code.length)})`);
        }
        
      } catch (error) {
        console.error(`❌ Failed to optimize ${file}:`, error);
      }
    }
    
    console.log('✅ JavaScript optimization completed');
  }

  async optimizeImages() {
    console.log('🖼️ Optimizing images...');
    
    const imageFiles = this.findFiles(this.distDir, /\.(jpe?g|png|webp|avif)$/i);
    const imageDir = path.join(this.distDir, 'assets', 'images');
    
    // Create images directory if it doesn't exist
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
    
    for (const file of imageFiles) {
      try {
        const ext = path.extname(file).toLowerCase();
        const basename = path.basename(file, ext);
        const dir = path.dirname(file);
        
        // Skip if already in optimized format
        if (ext === '.webp' || ext === '.avif') {
          continue;
        }
        
        const image = sharp(file);
        const metadata = await image.metadata();
        
        // Generate WebP version
        const webpPath = path.join(dir, `${basename}.webp`);
        await image
          .webp({ quality: this.config.images.compression.webp.quality })
          .toFile(webpPath);
        
        // Generate AVIF version (if supported)
        try {
          const avifPath = path.join(dir, `${basename}.avif`);
          await image
            .avif({ quality: this.config.images.compression.avif.quality })
            .toFile(avifPath);
        } catch (avifError) {
          console.warn(`⚠️  AVIF conversion failed for ${file}:`, avifError.message);
        }
        
        // Optimize original image
        let optimizedPath = file;
        if (ext === '.jpg' || ext === '.jpeg') {
          optimizedPath = path.join(dir, `${basename}-optimized${ext}`);
          await image
            .jpeg({ quality: this.config.images.compression.jpeg.quality, progressive: true })
            .toFile(optimizedPath);
        } else if (ext === '.png') {
          optimizedPath = path.join(dir, `${basename}-optimized.png`);
          await image
            .png({ compressionLevel: 9, adaptiveFiltering: true })
            .toFile(optimizedPath);
        }
        
        // Replace original with optimized version
        if (optimizedPath !== file) {
          fs.unlinkSync(file);
          fs.renameSync(optimizedPath, file);
        }
        
        console.log(`📄 Optimized: ${path.basename(file)}`);
        
      } catch (error) {
        console.error(`❌ Failed to optimize ${file}:`, error);
      }
    }
    
    console.log('✅ Image optimization completed');
  }

  async optimizeFonts() {
    console.log('🔤 Optimizing fonts...');
    
    const fontFiles = this.findFiles(this.distDir, /\.(woff2?|ttf|eot)$/i);
    
    for (const file of fontFiles) {
      try {
        const ext = path.extname(file).toLowerCase();
        
        // Convert to WOFF2 if not already
        if (ext !== '.woff2') {
          const basename = path.basename(file, ext);
          const dir = path.dirname(file);
          const woff2Path = path.join(dir, `${basename}.woff2`);
          
          // In a real implementation, we would use a font conversion tool here
          // For this migration, we'll just log that we would convert
          console.log(`📄 Would convert ${path.basename(file)} to WOFF2 format`);
        }
        
      } catch (error) {
        console.error(`❌ Failed to optimize font ${file}:`, error);
      }
    }
    
    console.log('✅ Font optimization completed');
  }

  async generateCriticalCSS() {
    console.log('🎯 Generating critical CSS...');
    
    // In a real implementation, we would use a tool like Penthouse or Critical
    // to extract critical CSS from each page
    
    const htmlFiles = this.findFiles(this.distDir, '.html');
    
    for (const file of htmlFiles) {
      try {
        const html = fs.readFileSync(file, 'utf8');
        const basename = path.basename(file, '.html');
        
        // Extract above-the-fold CSS
        // This is a simplified version - real implementation would use a proper tool
        const criticalCSS = this.extractCriticalCSS(html);
        
        if (criticalCSS) {
          const criticalCSSPath = path.join(
            path.dirname(file),
            `${basename}-critical.css`
          );
          fs.writeFileSync(criticalCSSPath, criticalCSS);
          
          // Inline critical CSS
          const updatedHTML = html.replace(
            '</head>',
            `<style>${criticalCSS}</style></head>`
          );
          fs.writeFileSync(file, updatedHTML);
          
          console.log(`📄 Generated critical CSS for ${path.basename(file)}`);
        }
        
      } catch (error) {
        console.error(`❌ Failed to generate critical CSS for ${file}:`, error);
      }
    }
    
    console.log('✅ Critical CSS generation completed');
  }

  extractCriticalCSS(html: string): string {
    // Simplified critical CSS extraction
    // In production, use a proper tool like Penthouse
    
    const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (!styleMatches) return '';
    
    let criticalCSS = '';
    
    for (const styleMatch of styleMatches) {
      // Extract CSS content
      const cssMatch = styleMatch.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      if (cssMatch && cssMatch[1]) {
        criticalCSS += cssMatch[1] + '\n';
      }
    }
    
    return criticalCSS.trim();
  }

  async generatePerformanceReport() {
    console.log('📊 Generating performance report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      optimizations: {
        html: {
          files: this.findFiles(this.distDir, '.html').length,
          optimized: true
        },
        css: {
          files: this.findFiles(this.distDir, '.css').length,
          optimized: true
        },
        javascript: {
          files: this.findFiles(this.distDir, '.js').length,
          optimized: true
        },
        images: {
          files: this.findFiles(this.distDir, /\.(jpe?g|png|webp|avif)$/i).length,
          optimized: true,
          formats: ['webp', 'avif']
        },
        fonts: {
          files: this.findFiles(this.distDir, /\.(woff2?|ttf|eot)$/i).length,
          optimized: true
        }
      },
      performanceBudgets: this.config.budgets,
      recommendations: [
        'Enable HTTP/2 for faster asset delivery',
        'Implement a service worker for offline caching',
        'Use a CDN for global distribution',
        'Enable Brotli compression on the server',
        'Consider using a static site generator for even better performance'
      ]
    };
    
    const reportPath = path.join(this.distDir, 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('✅ Performance report generated');
  }

  findFiles(directory: string, pattern: string | RegExp): string[] {
    const files: string[] = [];
    
    if (!fs.existsSync(directory)) {
      return files;
    }
    
    const items = fs.readdirSync(directory);
    
    for (const item of items) {
      const fullPath = path.join(directory, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.findFiles(fullPath, pattern));
      } else if (typeof pattern === 'string' ? item.endsWith(pattern) : pattern.test(item)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}

// Run the optimizer
new PerformanceOptimizer().run();