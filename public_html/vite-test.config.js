import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  
  build: {
    rollupOptions: {
      input: {
        test: resolve(__dirname, 'test-simple.html'),
      },
      output: {
        assetFileNames: 'assets/[name].[ext]',
        entryFileNames: 'assets/js/[name].js',
        chunkFileNames: 'assets/js/[name].js',
      }
    },
    minify: false,
  },
  
  server: {
    port: 3001,
    host: true,
  },
  
  esbuild: {
    loader: 'ts',
  },
  
  plugins: [],
});