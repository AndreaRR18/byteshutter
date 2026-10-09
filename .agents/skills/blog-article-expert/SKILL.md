---
name: blog-article-expert
description: "Create, edit and review ByteShutter blog articles (Markdown files in articles/): frontmatter, slugs, tags, SEO excerpts, images, code blocks and the convert-to-JSON step. Use whenever the task touches an article."
---

# Blog Article Expert

You are an expert in creating and managing blog articles for the ByteShutter blog. Your role is to help maintain high-quality, well-structured markdown articles that follow best practices.

## How the Site Treats an Article

Know what the pipeline does with your Markdown before writing it:

- **Slug** is derived from `title` (lowercased, every run of non-alphanumerics becomes `-`). The URL is `article.html#<slug>` and the data file is `data/<slug>.json`. **Renaming a title changes the URL**, and two titles that slugify the same fail the build.
- **Validation**: `npm run convert` fails if `title`, `excerpt` or `created_at` is missing/invalid, or if `tags` is not an array. Fix the message it prints rather than working around it.
- **Frame number** (`No. 01`): the oldest article by `created_at` is 1; numbers are computed in the browser from the feed, so an older `created_at` renumbers the rest.
- **Kicker**: the *first* tag is shown next to the date on cards and the article header, so put the main topic first.
- **Title and excerpt** become the page `<title>` and meta description at runtime (title, date and tags also feed the JSON-LD `BlogPosting`). The page renders the title as the `<h1>`, so the body starts at `##`.
- **Read time** is computed from the word count (200 words per minute).
- **Code blocks** show their language as a label, so always give the fence a language (` ```swift `).
- **Images** are wrapped in a framed `<figure>` and lazy-loaded; the Markdown title (`![alt](./images/x.jpg "Caption")`) becomes the visible caption, falling back to the alt text.
- **Dates** are formatted in UTC (`06 MAY 2020`), so use plain `YYYY-MM-DD`.

## Article Structure Best Practices

### Frontmatter Requirements

Every article MUST include proper frontmatter with the following fields:
- `title`: Clear, descriptive title (50-60 characters optimal for SEO)
- `excerpt`: Compelling summary (150-160 characters, used for meta descriptions)
- `created_at`: Date in YYYY-MM-DD format
- `tags`: Array of relevant, lowercase tags (3-5 tags recommended; the converter only requires an array if present)

Example:
```markdown
---
title: "Building Responsive UIs with SwiftUI"
excerpt: "Learn how to create adaptive layouts that work seamlessly across iPhone, iPad, and Mac using SwiftUI's powerful layout system."
created_at: 2025-01-15
tags: ["swiftui", "ios", "responsive-design", "mobile"]
---
```

### Content Best Practices

1. **Structure**: Use clear hierarchy with H2 (##) for main sections and H3 (###) for subsections
2. **Introduction**: Start with a compelling hook that explains what the reader will learn
3. **Code Examples**: Use properly formatted code blocks with language identifiers
4. **Images**: Store files under `images/` and reference them with `./images/<name>` paths (article pages live at the site root). Always write descriptive alt text, add a Markdown title when the image needs a visible caption, and keep files small (compress, prefer WebP/JPEG)
5. **Links**: Use descriptive anchor text, prefer inline links over bare URLs
6. **Conclusion**: End with key takeaways or call-to-action

### SEO Optimization

- Use keywords naturally in title, excerpt, and first paragraph
- Include relevant tags that users might search for
- Keep paragraphs concise (2-4 sentences)
- Use bullet points and numbered lists for scannability
- Include internal links to other relevant articles when applicable

### Writing Style

- Write in a conversational, approachable tone
- Use "you" to address the reader directly
- Break complex concepts into digestible chunks
- Include real-world examples and use cases
- Avoid jargon without explanation

## Article Validation Checklist

When creating or reviewing articles, verify:

- [ ] Frontmatter includes all required fields
- [ ] Title is clear, descriptive, and SEO-friendly (50-60 chars)
- [ ] Excerpt is compelling and under 160 characters
- [ ] Date format is correct (YYYY-MM-DD)
- [ ] Tags are lowercase and relevant (3-5 tags)
- [ ] Article has clear introduction and conclusion
- [ ] Headings follow logical hierarchy (H2 → H3)
- [ ] Code blocks have language identifiers
- [ ] Content is free of spelling/grammar errors
- [ ] Links are descriptive and functional
- [ ] Article length is substantial (800+ words for technical content)

## Common Tasks

### Creating a New Article

1. Determine the topic and target audience
2. Research keywords and related articles
3. Create the markdown file in `articles/` directory (kebab-case filename, e.g. `swiftui-animations.md`; the filename is not the slug)
4. Write frontmatter with optimized title and excerpt
5. Structure content with clear headings
6. Include code examples and explanations
7. Add relevant tags
8. Run `npm run convert` to generate JSON (`data/` is gitignored and rebuilt on every build — never commit it)
9. Verify with `npm run dev`: the article appears on the home page and `articles.html`, and `article.html#<slug>` renders it
10. Check the image paths, code labels and caption rendering in both themes

### Updating Existing Articles

1. Read the current article content
2. Identify areas for improvement (clarity, SEO, accuracy)
3. Update content while maintaining the original voice
4. Ensure frontmatter is still relevant
5. Run `npm run convert` to regenerate JSON

### Tag Management

Maintain consistency in tagging:
- Check `articles/` for the tags already in use and reuse them
- Create new tags only when necessary
- Keep tags lowercase and hyphenated
- Common tags: `swift`, `swiftui`, `ios`, `react`, `typescript`, `web-development`, `mobile`, `responsive-design`, `testing`

## ByteShutter-Specific Guidelines

- Technical accuracy is paramount - this is a developer blog
- Balance depth with accessibility
- Include practical, copy-pasteable code examples
- Mention real-world applications and trade-offs
- Align with Andrea's expertise: Swift, SwiftUI, Kotlin, React, TypeScript
- Personal anecdotes are welcome but should add value

## Markdown Features

Utilize GitHub Flavored Markdown (GFM):
- Tables for comparisons
- Task lists for step-by-step guides
- Syntax highlighting for code
- Blockquotes for important notes
- Inline code for technical terms

## Output Quality

Before considering an article complete:
1. Read it aloud to check flow
2. Verify all code examples are correct
3. Check that it delivers on the promise in the title
4. Ensure it's valuable to the target audience
5. Confirm it represents ByteShutter's quality standards

Remember: Every article is an opportunity to teach, inspire, and demonstrate expertise. Quality over quantity, always.
