# injectComponents Refactor Design

**Date:** 2026-04-29
**Branch:** update-components
**Scope:** Fix 7 issues identified in PR #47 code review — no new features, no scope creep.

---

## Context

PR #47 introduced a build-time component injection system. A code review identified the following issues:

1. `prepare` is an npm lifecycle hook name — runs unexpectedly on `npm install`
2. Replacement for `<!-- HEAD -->` and `<title><!-- TITLE --></title>` is a single whitespace-sensitive match — breaks silently on any template reformatting
3. Dead code block in `main()` copies templates to root unconditionally but serves no purpose
4. `prepareTemplates.js` is fully redundant with the dead code block
5. Build does not fail on page processing error — broken pages silently pass through
6. `replaceTemplateVariables` uses `new RegExp` unnecessarily — `split/join` is simpler and safer
7. `article.html` config has generic placeholder values with no explanation — looks like a bug

---

## Changes

### `scripts/InjectComponents/injectComponents.ts`

**Fix brittle replacement (approach A):**  
Split the combined `<!-- HEAD -->\n  <title><!-- TITLE --></title>` match into four independent `.replace()` calls:

```typescript
htmlContent = htmlContent
  .replace('<!-- HEAD -->', processedHead.trim())
  .replace('<title><!-- TITLE --></title>', `<title>${pageConfig.title}</title>`)
  .replace('<!-- HEADER -->', processedHeader)
  .replace('<!-- FOOTER -->', footer);
```

Each slot is matched independently — no whitespace coupling between them.

**Remove dead copy block:**  
Delete the loop at the start of `main()` (lines 141–151) that copies templates to root if they don't exist. `processPage()` always reads from `templates/` and always writes to root; the copy block is never effective.

**Fail the build on error:**  
Replace the `catch` block that logs and continues with one that logs and calls `process.exit(1)`. A broken page must fail the build, not produce silent bad output.

**Simplify `replaceTemplateVariables`:**  
Replace `content.replace(new RegExp(template, 'g'), value)` with `content.split(template).join(value)`. Avoids constructing a regex from user-controlled keys, functionally identical for this use case.

**Add `article.html` config comment:**  
Add an inline comment on the `article.html` config entry explaining that these are intentional placeholder values — `article.js` overwrites title, description, and OG tags at runtime after loading the article JSON.

### `package.json`

**Remove `prepare` script and step:**  
Delete the `"prepare"` entry entirely and remove `npm run prepare &&` from `dev` and `build`. The `inject` step reads directly from `templates/` — no preliminary copy is needed.

Resulting scripts:
```json
"dev":   "npm run compile && npm run convert && npm run inject && npx serve . -p 3000",
"build": "npm run compile && npm run convert && npm run inject && mkdir -p dist && cp -r index.html articles.html article.html about.html favicon.svg .nojekyll css js images data dist/"
```

### `scripts/prepareTemplates.js`

**Delete the file.** It duplicates the dead copy logic removed from `main()` and is no longer referenced.

---

## What is NOT changed

- Template placeholder format (`<!-- COMMENT -->` and `{{var}}`) — unchanged
- Component files (`components/`) — unchanged
- Template files (`templates/`) — unchanged
- `PageConfig` interface and per-page config data — unchanged (except the comment on `article.html`)
- Build output structure — unchanged
