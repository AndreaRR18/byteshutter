import '@testing-library/jest-dom';
import { expect, afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Clean up after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  // Clean up document body after each test
  document.body.innerHTML = '';
  document.body.style.overflow = 'unset';
});

beforeEach(() => {
  // Clean up document body before each test
  document.body.innerHTML = '';
  document.body.style.overflow = 'unset';
});