import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/byteshutter/' : '/',
    
    // HTML entry points
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          about: resolve(__dirname, 'pages/about.html'),
          articles: resolve(__dirname, 'pages/articles.html'),
          article: resolve(__dirname, 'pages/article.html'),
        },
        output: {
          // Keep asset names consistent
          assetFileNames: 'assets/[name].[ext]',
          entryFileNames: 'assets/js/[name].js',
          chunkFileNames: 'assets/js/[name].js',
        }
      },
      // Minify output
      minify: true,
      // Enable CSS code splitting
      cssCodeSplit: true,
    },
    
    server: {
      port: 3000,
      host: true,
    },
    
    // CSS processing
    css: {
      postcss: {
        plugins: [],
      },
      modules: {
        // Disable CSS modules since we're using global CSS
        generateScopedName: false,
        localsConvention: 'camelCase',
      },
    },
    
    // Optimize dependencies
    optimizeDeps: {
      include: [],
      exclude: [],
    },
    
    // Plugin configuration (no React plugin)
    plugins: [],
    
    // Resolve aliases
    resolve: {
      alias: {
        '@': resolve(__dirname, './'),
        '@assets': resolve(__dirname, './assets'),
        '@components': resolve(__dirname, './components'),
        '@pages': resolve(__dirname, './pages'),
        '@data': resolve(__dirname, './data'),
      },
    },
  };
});