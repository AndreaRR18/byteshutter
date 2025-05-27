import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src', // Relative path to the source directory
  build: {
    outDir: '../dist', // Output directory relative to the project root
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html', // Relative to the root
      },
    },
  },
});
