---
name: html-standards
description: Apply authoritative HTML best practices: semantic structure, accessibility (WCAG 2.2), performance, responsive images, and document hygiene. Invoke before writing or reviewing any HTML.
---

# HTML Standards

Reference this skill before writing or reviewing any HTML in this project. Apply every applicable rule — skip only rules that genuinely don't apply to the element at hand.

## Document Structure

- Always start with `<!doctype html>`
- `<meta charset="utf-8">` must be the **first** tag in `<head>`
- Always include `<meta name="viewport" content="width=device-width, initial-scale=1">`
- Use `lang` attribute on `<html>`: `<html lang="en">`
- Omit `type` attribute on `<script>` and `<link rel="stylesheet">` — not needed in HTML5
- Use lowercase for all tags, attributes, and attribute values
- Use double quotes for all attribute values

## Semantic Structure

- Use `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<section>`, `<footer>` — not generic `<div>` wrappers
- One `<main>` per page; it contains the unique primary content
- Use proper heading hierarchy: one `<h1>` per page, then `<h2>`, `<h3>` in order — never skip levels
- Use `<figure>` + `<figcaption>` for images with captions
- Use `<time datetime="YYYY-MM-DD">` for dates
- Use `<abbr title="Full Name">` for abbreviations on first use
- Use native controls: `<button>` for actions, `<a href>` for navigation — never `<div onclick>`

## Accessibility (WCAG 2.2)

- Every `<img>` must have `alt`: descriptive text for informational images, `alt=""` for purely decorative ones
- All form `<input>` elements must have an associated `<label for="id">` or `aria-label`
- Link text must be self-explanatory out of context — "Read more about X", never "click here"
- Include a skip link as the first element in `<body>`: `<a href="#main-content" class="skip-link">Skip to main content</a>`
- Use `tabindex="0"` to add elements to tab order, `tabindex="-1"` for JS-only focus — never positive values
- Add `aria-label` on icon-only buttons and interactive elements with no visible text
- Use `aria-current="page"` on the active navigation link
- Data tables need `<th scope="col">` or `<th scope="row">` and `<caption>`
- Never remove focus outlines without providing a visible replacement

## Images & Media

- Always include fallback `src` on `<img>` inside `<picture>`
- Use `srcset` + `sizes` for responsive images:
  ```html
  <img
    srcset="img-480.jpg 480w, img-800.jpg 800w"
    sizes="(max-width: 600px) 480px, 800px"
    src="img-800.jpg"
    alt="Description" />
  ```
- Use `<picture>` with `<source type="image/webp">` to serve WebP with JPEG/PNG fallback
- Use `loading="lazy"` on below-the-fold images; never on hero/above-fold images
- Let CSS control image sizing — avoid hardcoded `width`/`height` attributes on responsive images
- Use `object-fit: cover` in CSS for fixed-dimension image containers

## Performance

- Mark non-critical scripts with `defer` or `async`; never block parsing with `<script>` in `<head>`
- Preload critical fonts:
  ```html
  <link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
  ```
- Use `<link rel="preconnect">` for third-party font/asset domains (Google Fonts, CDNs)
- Load Google Fonts with `display=swap` in the URL: `?display=swap`

## Code Hygiene

- Indent with 2 spaces consistently
- Prefer `class` over `id` for styling; reserve `id` for JS hooks and fragment anchors
- Use hyphens in `id` values: `main-content`, not `mainContent`
- No entity references for normal UTF-8 characters — use the character directly; only escape `<`, `>`, `&`
- Remove all commented-out code before committing
