// Test Setup File
// Configures the testing environment

import { expect } from 'vitest';
import { JSDOM } from 'jsdom';

// Set up JSDOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window as unknown as Window & typeof globalThis;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock matchMedia for theme testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true
  })
});

// Extend expect with custom matchers
expect.extend({
  toBeInDOM(element: HTMLElement) {
    if (!document.body.contains(element)) {
      return {
        message: () => `expected ${element} to be in DOM`,
        pass: false
      };
    }
    
    return {
      message: () => `expected ${element} not to be in DOM`,
      pass: true
    };
  },
  
  toHaveClass(element: HTMLElement, className: string) {
    if (!element.classList.contains(className)) {
      return {
        message: () => `expected ${element} to have class ${className}`,
        pass: false
      };
    }
    
    return {
      message: () => `expected ${element} not to have class ${className}`,
      pass: true
    };
  }
});

// Global test utilities
global.testUtils = {
  createElement: (html: string): HTMLElement => {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstElementChild as HTMLElement;
  },
  
  triggerEvent: (element: HTMLElement, eventName: string) => {
    const event = new Event(eventName, { bubbles: true });
    element.dispatchEvent(event);
  },
  
  mockFetch: (data: unknown) => {
    global.fetch = async () => ({
      ok: true,
      json: async () => data,
      text: async () => JSON.stringify(data)
    }) as Response;
  },
  
  restoreFetch: () => {
    delete global.fetch;
  }
};

declare global {
  interface Global {
    testUtils: {
      createElement: (html: string) => HTMLElement;
      triggerEvent: (element: HTMLElement, eventName: string) => void;
      mockFetch: (data: unknown) => void;
      restoreFetch: () => void;
    };
  }
}

export {};