# ByteShutter Linting Guide

## 🎯 Overview

This guide explains the linting setup for the ByteShutter project, which includes both the React version and the HTML/CSS migration.

## 📋 Linting Configuration

### ESLint Configuration

The project uses ESLint with the following extensions:

- **Base**: `eslint:recommended`
- **TypeScript**: `@typescript-eslint/recommended`
- **React**: `plugin:react/recommended`, `plugin:react-hooks/recommended`
- **Import**: `plugin:import/recommended`, `plugin:import/typescript`
- **Prettier**: `plugin:prettier/recommended`

### Prettier Configuration

Prettier is integrated with ESLint for consistent code formatting.

## 🚀 Available Commands

### Basic Linting

```bash
# Lint all files
npm run lint

# Lint and auto-fix issues
npm run lint:fix

# Lint only React files
npm run lint:react

# Lint only HTML/CSS migration files
npm run lint:html

# Lint both React and HTML/CSS files
npm run lint:all
```

### File Extensions

The linter checks the following file extensions:
- `.ts` - TypeScript files
- `.tsx` - TypeScript React files
- `.js` - JavaScript files
- `.jsx` - JavaScript React files

## 📖 Linting Rules

### General JavaScript/TypeScript Rules

| Rule | Description |
|------|-------------|
| `no-console` | Warns about console statements |
| `no-debugger` | Errors on debugger statements |
| `no-restricted-syntax` | Bans `for..in` and `with` statements |
| `no-restricted-imports` | Enforces named React imports |

### TypeScript-Specific Rules

| Rule | Description |
|------|-------------|
| `@typescript-eslint/no-unused-vars` | Errors on unused variables (ignores `_` prefix) |
| `@typescript-eslint/no-explicit-any` | Warns about `any` type usage |
| `@typescript-eslint/consistent-type-imports` | Enforces consistent type imports |
| `@typescript-eslint/ban-types` | Bans certain types (with exceptions) |

### React-Specific Rules

| Rule | Description |
|------|-------------|
| `react/react-in-jsx-scope` | Disabled (not needed with React 17+) |
| `react/prop-types` | Disabled (not needed with TypeScript) |
| `react/jsx-uses-react` | Disabled (not needed with React 17+) |
| `react/jsx-no-target-blank` | Errors on `target="_blank"` without `rel="noopener noreferrer"` |
| `react-hooks/rules-of-hooks` | Enforces Rules of Hooks |
| `react-hooks/exhaustive-deps` | Warns about missing dependencies in effect hooks |

### Import Rules

| Rule | Description |
|------|-------------|
| `import/no-unresolved` | Errors on unresolved imports |
| `import/named` | Errors on incorrect named imports |
| `import/namespace` | Errors on incorrect namespace imports |
| `import/default` | Errors on incorrect default imports |
| `import/export` | Errors on incorrect exports |
| `import/no-extraneous-dependencies` | Errors on extraneous dependencies |
| `import/order` | Enforces import ordering and grouping |

### Import Order

Imports are automatically sorted in this order:

1. **Built-in modules** (Node.js built-ins)
2. **External modules** (npm packages)
3. **Internal modules** (project files)
4. **Parent directory imports**
5. **Sibling directory imports**
6. **Index files**
7. **Object imports**
8. **Type imports**

With special grouping for:
- `react` - Always first among external imports
- `@/**` - Internal path aliases

### Prettier Rules

| Rule | Value |
|------|-------|
| `semi` | `true` (semicolons required) |
| `singleQuote` | `true` (single quotes) |
| `tabWidth` | `2` (2 spaces for indentation) |
| `trailingComma` | `'es5'` (trailing commas where valid) |
| `printWidth` | `100` (line length) |
| `arrowParens` | `'always'` (parentheses around arrow function params) |
| `endOfLine` | `'lf'` (LF line endings) |
| `bracketSpacing` | `true` (spaces in object literals) |

## 🎨 Code Style Guidelines

### TypeScript

```typescript
// ✅ Good - Type imports
import type { User } from './types';

// ✅ Good - Named imports
import { useState, useEffect } from 'react';

// ❌ Bad - Default import
import React from 'react';

// ✅ Good - Ignore unused vars with _ prefix
function example(_unusedParam: string) {}

// ✅ Good - Explicit return types for public APIs
function getUser(id: string): Promise<User> {}
```

### React

```jsx
// ✅ Good - Functional components
const MyComponent = () => {
  return <div>Hello</div>;
};

// ✅ Good - Hooks usage
const [state, setState] = useState(initialState);

useEffect(() => {
  // Effect logic
}, [dependencies]); // ✅ Always specify dependencies

// ✅ Good - Event handlers
<button onClick={() => handleClick()}>Click</button>

// ✅ Good - JSX props
<MyComponent 
  prop1="value"
  prop2={expression}
  onEvent={handler}
/>
```

### Imports

```typescript
// ✅ Good - Ordered imports
import fs from 'fs'; // Built-in
import React from 'react'; // External (React first)
import { useQuery } from '@tanstack/react-query'; // External
import { Button } from '@components/Button'; // Internal alias
import { utils } from '../utils'; // Parent
import { helper } from './helper'; // Sibling

// ✅ Good - Type-only imports
import type { User } from './types';
```

## 🔧 Customization

### Overrides

The configuration includes overrides for specific file types:

- **JavaScript files**: Relaxes TypeScript-specific rules
- **Test files**: Allows `any` type and TS comments
- **Config files**: Allows default exports and `require()` calls
- **HTML/CSS migration**: Disables React-specific rules

### Project-Specific Rules

Add project-specific rules in the `.eslintrc.cjs` file under the `rules` section.

## 🛠️ Editor Integration

### VS Code

Add this to your VS Code settings:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "eslint.workingDirectories": [
    {"mode": "auto"}
  ]
}
```

### WebStorm/IntelliJ

1. Install ESLint and Prettier plugins
2. Enable "Run eslint --fix on save"
3. Set ESLint to use the project configuration

## 🚫 Common Issues & Fixes

### Issue: ESLint not running

**Fix:**
```bash
npm install
npm run lint
```

### Issue: Prettier formatting conflicts

**Fix:** Run Prettier separately:
```bash
npx prettier --write .
```

### Issue: TypeScript errors in linting

**Fix:** Run TypeScript compiler first:
```bash
npx tsc --noEmit
npm run lint
```

### Issue: Import ordering

**Fix:** Let ESLint auto-fix:
```bash
npm run lint:fix
```

## 📝 Best Practices

1. **Run linting before commits**: Use a pre-commit hook
2. **Fix issues incrementally**: Use `npm run lint:fix` regularly
3. **Review linting errors**: Understand why rules exist
4. **Customize carefully**: Only disable rules when necessary
5. **Keep dependencies updated**: Regularly update ESLint and plugins

## 🔄 Continuous Integration

Add this to your CI pipeline:

```yaml
- name: Lint
  run: npm run lint
```

## 📚 Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [React ESLint](https://github.com/jsx-eslint/eslint-plugin-react)
- [Import Plugin](https://github.com/import-js/eslint-plugin-import)
- [Prettier](https://prettier.io/)

## 🎉 Summary

The ByteShutter project now has comprehensive linting that:

- ✅ Enforces consistent code style
- ✅ Catches common errors early
- ✅ Supports both React and HTML/CSS codebases
- ✅ Integrates with Prettier for formatting
- ✅ Provides auto-fix capabilities
- ✅ Works in CI/CD pipelines

Use `npm run lint` regularly to maintain code quality!