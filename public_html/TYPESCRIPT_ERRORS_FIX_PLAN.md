# TypeScript Errors Fix Plan

## Current Status
The ByteShutter HTML/CSS migration has several TypeScript compilation errors that prevent the project from building and running properly.

## Error Categories

### 1. Type Mismatch Errors
- **Files**: `header.ts`, `main.ts`
- **Issues**: 
  - `string | undefined` not assignable to `string`
  - `boolean | undefined` not assignable to `boolean`
  - `Element` not assignable to `HTMLElement`

### 2. Missing Type Declarations
- **Files**: `header.ts`, `main.ts`, `router.ts`, page files
- **Issues**: 
  - `window.themeManager` not recognized
  - `window.router` not recognized
  - Custom event types not properly typed

### 3. Syntax Errors
- **Files**: `article.ts`, `router.ts`
- **Issues**: 
  - Unterminated string literals
  - Incorrect method chaining
  - Regex syntax issues

### 4. Module Import Errors
- **Files**: Page files (`article.ts`, `articles.ts`, `home.ts`)
- **Issues**: 
  - Incorrect import paths for `dataService`

### 5. API Type Errors
- **Files**: `performanceService.ts`, `seoService.ts`
- **Issues**: 
  - Missing browser API types (PerformanceEntry, CSSStyleDeclaration, etc.)
  - Type mismatches in structured data

## Fix Strategy

### Phase 1: Fix Critical Compilation Errors
1. **Fix import paths** - Update all incorrect import statements
2. **Fix syntax errors** - Correct string literals and regex patterns
3. **Fix type mismatches** - Add proper type assertions and null checks

### Phase 2: Enhance Type Safety
1. **Update global.d.ts** - Ensure all window properties are properly declared
2. **Add type guards** - Improve type safety for optional values
3. **Fix event handling** - Properly type custom events

### Phase 3: Browser API Compatibility
1. **Add lib declarations** - Include DOM and browser API types
2. **Fix performance API** - Add proper types for performance-related APIs
3. **Fix CSS API** - Add proper types for CSS properties

## Specific Fixes Needed

### 1. Fix Import Paths (DONE)
- ✅ Updated `article.ts`, `articles.ts`, `home.ts` to use correct import paths

### 2. Fix Syntax Errors (PARTIAL)
- ✅ Fixed unterminated string in `articles.ts`
- ✅ Fixed unterminated strings in `router.ts`
- ❌ Need to fix regex syntax in `article.ts`
- ❌ Need to fix method chaining in `article.ts`

### 3. Fix Type Mismatches
- ❌ `header.ts` lines 25, 26: Add type assertions for querySelector results
- ❌ `main.ts` lines 188, 204: Add null checks for boolean options
- ❌ `main.ts` lines 160, 161, 162: Add type assertions for Element to HTMLElement

### 4. Fix Event Handling
- ❌ `header.ts` line 60: Fix unused event parameter
- ❌ `main.ts` lines 123, 130: Fix custom event typing

### 5. Fix Browser API Types
- ❌ `performanceService.ts`: Add proper types for PerformanceEntry, CSSStyleDeclaration
- ❌ `seoService.ts`: Fix structured data type issues

## Immediate Action Plan

1. **Fix remaining syntax errors** in `article.ts`
2. **Add proper type assertions** in `header.ts` and `main.ts`
3. **Fix event parameter usage** in event listeners
4. **Update tsconfig.json** to include proper lib declarations
5. **Test compilation** after each fix

## Expected Outcome
After implementing these fixes, the TypeScript compiler should pass without errors, allowing the Vite development server to start and the application to run properly.

## Next Steps
1. Fix the remaining syntax errors in `article.ts`
2. Address type mismatch errors
3. Test the compilation process
4. Run the development server
5. Identify and fix any runtime errors