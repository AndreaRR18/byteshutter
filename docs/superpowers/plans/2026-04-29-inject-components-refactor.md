# injectComponents Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 7 issues found in the PR #47 code review of the component injection build pipeline.

**Architecture:** Two files change (`injectComponents.ts` and `package.json`), one file is deleted (`prepareTemplates.js`). No new files. No changes to templates, components, or HTML output structure.

**Tech Stack:** TypeScript (Node.js), npm scripts, `tsx` runner, `fs`/`path` Node built-ins.

**Spec:** `docs/superpowers/specs/2026-04-29-inject-components-refactor-design.md`

---

## File Map

| Action | File | What changes |
|--------|------|-------------|
| Modify | `package.json` | Remove `"prepare"` script entry; remove `npm run prepare &&` from `dev` and `build` |
| Delete | `scripts/prepareTemplates.js` | Entire file removed |
| Modify | `scripts/InjectComponents/injectComponents.ts` | 5 targeted changes (see tasks below) |

---

## Task 1: Remove redundant `prepare` infrastructure

**Files:**
- Modify: `package.json`
- Delete: `scripts/prepareTemplates.js`

- [ ] **Step 1: Update `package.json` — remove `prepare` script and the step from `dev`/`build`**

Replace the `"scripts"` block in `package.json` with:

```json
"scripts": {
  "compile": "tsc -p tsconfig.browser.json",
  "convert": "npx tsx scripts/ConvertArticlesToJSON/convertArticlesToJson.ts",
  "inject": "npx tsx scripts/InjectComponents/injectComponents.ts",
  "dev": "npm run compile && npm run convert && npm run inject && npx serve . -p 3000",
  "build": "npm run compile && npm run convert && npm run inject && mkdir -p dist && cp -r index.html articles.html article.html about.html favicon.svg .nojekyll css js images data dist/"
}
```

- [ ] **Step 2: Delete `scripts/prepareTemplates.js`**

```bash
rm scripts/prepareTemplates.js
```

- [ ] **Step 3: Verify `npm run inject` still works without the prepare step**

Delete any previously generated root HTML files, then run inject:

```bash
rm -f index.html about.html articles.html article.html
npm run inject
```

Expected output:
```
Processing: index.html
  Generated: index.html
Processing: about.html
  Generated: about.html
Processing: articles.html
  Generated: articles.html
Processing: article.html
  Generated: article.html

Component injection complete!
```

Verify all 4 files were created:
```bash
ls -la index.html about.html articles.html article.html
```

- [ ] **Step 4: Commit**

```bash
git add package.json scripts/prepareTemplates.js
git commit -m "refactor: remove redundant prepare step and prepareTemplates.js"
```

---

## Task 2: Fix `injectComponents.ts` — correctness issues

**Files:**
- Modify: `scripts/InjectComponents/injectComponents.ts`

### Change 1: Fix brittle replacement

- [ ] **Step 5: Replace the combined match with 4 independent `.replace()` calls**

Find lines 128–131 in `injectComponents.ts`:

```typescript
  // Replace placeholders in the template
  htmlContent = htmlContent
    .replace('<!-- HEAD -->\n  <title><!-- TITLE --></title>', `<title>${pageConfig.title}</title>\n  ${processedHead.trim()}`)
    .replace('<!-- HEADER -->', processedHeader)
    .replace('<!-- FOOTER -->', footer);
```

Replace with:

```typescript
  // Replace placeholders in the template
  htmlContent = htmlContent
    .replace('<!-- HEAD -->', processedHead.trim())
    .replace('<title><!-- TITLE --></title>', `<title>${pageConfig.title}</title>`)
    .replace('<!-- HEADER -->', processedHeader)
    .replace('<!-- FOOTER -->', footer);
```

### Change 2: Remove dead copy block from `main()`

- [ ] **Step 6: Delete the dead template-copy loop at the top of `main()`**

Find and remove these lines from `main()` (currently lines 140–151):

```typescript
  // First, copy templates to root if they don't exist
  for (const pageName of pages) {
    const templatePath = path.resolve('.', 'templates', pageName);
    const outputPath = path.resolve('.', pageName);
    
    if (!fs.existsSync(outputPath)) {
      if (fs.existsSync(templatePath)) {
        fs.copyFileSync(templatePath, outputPath);
        console.log(`  Copied template: ${pageName}`);
      }
    }
  }
  
```

The `main()` function body should now start directly with:

```typescript
function main() {
  const pages = ['index.html', 'about.html', 'articles.html', 'article.html'];
  
  for (const pageName of pages) {
```

### Change 3: Exit non-zero on error

- [ ] **Step 7: Track errors and call `process.exit(1)` if any page fails**

Find the current `for` loop in `main()`:

```typescript
  for (const pageName of pages) {
    try {
      console.log(`Processing: ${pageName}`);
      const processed = processPage(pageName);
      
      // Write to root directory
      const outputPath = path.resolve('.', pageName);
      fs.writeFileSync(outputPath, processed);
      console.log(`  Generated: ${pageName}`);
    } catch (error) {
      console.error(`  Error processing ${pageName}:`, error instanceof Error ? error.message : error);
    }
  }

  console.log('\nComponent injection complete!');
```

Replace with:

```typescript
  let hasError = false;

  for (const pageName of pages) {
    try {
      console.log(`Processing: ${pageName}`);
      const processed = processPage(pageName);

      const outputPath = path.resolve('.', pageName);
      fs.writeFileSync(outputPath, processed);
      console.log(`  Generated: ${pageName}`);
    } catch (error) {
      console.error(`  Error processing ${pageName}:`, error instanceof Error ? error.message : error);
      hasError = true;
    }
  }

  if (hasError) {
    process.exit(1);
  }

  console.log('\nComponent injection complete!');
```

- [ ] **Step 8: Verify all three changes work correctly**

Run inject and confirm output:

```bash
rm -f index.html about.html articles.html article.html
npm run inject
```

Expected: same success output as Step 3.

Spot-check the title is correctly injected (not a comment placeholder):

```bash
grep -n "<title>" index.html about.html articles.html article.html
```

Expected:
```
index.html:4:  <title>ByteShutter</title>
about.html:4:  <title>About - ByteShutter</title>
articles.html:4:  <title>Articles - ByteShutter</title>
article.html:4:  <title>ByteShutter</title>
```

Confirm no `{{var}}` placeholders leaked into the output:

```bash
grep -r '{{' index.html about.html articles.html article.html && echo "FAIL: placeholders found" || echo "OK: no placeholders"
```

Expected: `OK: no placeholders`

- [ ] **Step 9: Commit**

```bash
git add scripts/InjectComponents/injectComponents.ts
git commit -m "fix: split brittle HEAD replacement, remove dead copy block, exit on error"
```

---

## Task 3: Fix `injectComponents.ts` — code quality issues

**Files:**
- Modify: `scripts/InjectComponents/injectComponents.ts`

### Change 4: Simplify `replaceTemplateVariables`

- [ ] **Step 10: Replace `new RegExp` with `split/join`**

Find `replaceTemplateVariables` (lines 79–85):

```typescript
function replaceTemplateVariables(content: string, replacements: Record<string, string>): string {
  for (const [key, value] of Object.entries(replacements)) {
    const template = `{{${key}}}`;
    content = content.replace(new RegExp(template, 'g'), value);
  }
  return content;
}
```

Replace with:

```typescript
function replaceTemplateVariables(content: string, replacements: Record<string, string>): string {
  for (const [key, value] of Object.entries(replacements)) {
    const template = `{{${key}}}`;
    content = content.split(template).join(value);
  }
  return content;
}
```

### Change 5: Add `article.html` config comment

- [ ] **Step 11: Add comment to `article.html` config entry**

Find the `'article.html'` entry in the `config` object:

```typescript
  'article.html': {
    title: 'ByteShutter',
```

Replace with:

```typescript
  // article.html uses placeholder SEO values — article.js overwrites title, description,
  // og:title, og:description, and og:url at runtime after loading the article JSON.
  'article.html': {
    title: 'ByteShutter',
```

- [ ] **Step 12: Run TypeScript compiler to confirm no type errors**

```bash
npx tsc -p tsconfig.browser.json --noEmit 2>&1 | head -20
```

Expected: no output (exit 0).

- [ ] **Step 13: Run inject one final time and confirm output is identical**

```bash
rm -f index.html about.html articles.html article.html
npm run inject
grep -n "<title>" index.html about.html articles.html article.html
grep -r '{{' index.html about.html articles.html article.html && echo "FAIL" || echo "OK: no placeholders"
```

Expected: same results as Step 8.

- [ ] **Step 14: Commit**

```bash
git add scripts/InjectComponents/injectComponents.ts
git commit -m "refactor: simplify replaceTemplateVariables, document article.html placeholders"
```
