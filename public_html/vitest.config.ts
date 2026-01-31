// Vitest Configuration
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    // Environment
    environment: 'jsdom',
    globals: true,
    
    // Setup files
    setupFiles: [resolve(__dirname, 'tests/testSetup.ts')],
    
    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: resolve(__dirname, 'coverage'),
      include: ['assets/js/**/*.ts'],
      exclude: ['**/*.test.ts', '**/testSetup.ts']
    },
    
    // Test files
    include: ['tests/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    
    // Timeout
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Reporters
    reporters: ['default', 'json'],
    outputFile: resolve(__dirname, 'test-results.json'),
    
    // Watch mode
    watch: {
      enabled: true,
      exclude: ['**/node_modules/**', '**/dist/**']
    },
    
    // Aliases
    alias: {
      '@': resolve(__dirname, './'),
      '@assets': resolve(__dirname, './assets'),
      '@tests': resolve(__dirname, './tests')
    },
    
    // TypeScript
    typecheck: {
      enabled: true,
      tsconfig: resolve(__dirname, 'tsconfig.json')
    }
  }
});