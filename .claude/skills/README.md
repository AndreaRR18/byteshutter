# ByteShutter Claude Skills

This directory contains custom Claude Code skills tailored for the ByteShutter blog development. These skills provide best practices, guidelines, and expert knowledge for maintaining and improving the blog.

## Available Skills

### 1. blog-article-expert

Expert in creating and managing blog articles with proper structure, SEO optimization, and content quality.

**Use when:**
- Creating new blog articles
- Reviewing or updating existing articles
- Optimizing article metadata (title, excerpt, tags)
- Ensuring content follows best practices
- Managing article frontmatter

**Key features:**
- Frontmatter validation
- SEO optimization guidelines
- Content structure best practices
- Tag management
- Article quality checklist

**Example usage:**
```
/skill blog-article-expert
Create a new article about building animations in SwiftUI
```

### 2. react-component-expert

Expert in building React components using modern React 19, TypeScript, and Vite best practices.

**Use when:**
- Creating new React components
- Refactoring existing components
- Implementing TypeScript types
- Optimizing component performance
- Following ByteShutter component patterns

**Key features:**
- TypeScript best practices
- React 19 patterns
- Performance optimization
- CSS Modules usage
- Component structure guidelines
- Testing considerations

**Example usage:**
```
/skill react-component-expert
Build a new card component for displaying book recommendations
```

### 3. web-accessibility-seo-expert

Expert in web accessibility (WCAG 2.1) and SEO optimization for React/Vite applications.

**Use when:**
- Auditing components for accessibility
- Implementing ARIA patterns
- Optimizing for search engines
- Adding meta tags and structured data
- Improving keyboard navigation
- Checking color contrast and semantics

**Key features:**
- WCAG 2.1 compliance guidelines
- Semantic HTML best practices
- ARIA patterns and usage
- SEO optimization (meta tags, structured data)
- Keyboard navigation
- Performance considerations
- Testing checklists

**Example usage:**
```
/skill web-accessibility-seo-expert
Review the About page for accessibility issues and add proper SEO meta tags
```

## How to Use Skills

Skills are invoked using the `/skill` command in Claude Code:

```
/skill <skill-name>
<your task or question>
```

Or reference them in your prompt:

```
Using the react-component-expert skill, help me create a responsive navigation component
```

## Skill Organization

Each skill is organized in its own directory with a `SKILL.md` file containing:
- Expert role definition
- Core principles and best practices
- Code examples and patterns
- Checklists and guidelines
- ByteShutter-specific conventions
- Testing considerations
- Common pitfalls to avoid

## Best Practices for Using Skills

1. **Be Specific**: Provide clear context about what you're building or fixing
2. **Reference Existing Code**: Mention specific files or components when applicable
3. **Ask for Checklists**: Request validation checklists for comprehensive reviews
4. **Combine Skills**: Multiple skills can be used together for complex tasks
5. **Iterate**: Use skills iteratively to refine and improve code

## Skill Development

These skills were developed based on:
- Official React 19 and TypeScript documentation
- WCAG 2.1 accessibility guidelines
- Modern SEO best practices for 2025
- ByteShutter's existing codebase patterns
- Community best practices from repositories like:
  - [awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)
  - [claudekit-skills](https://github.com/mrgoonie/claudekit-skills)
  - [claude-skills](https://github.com/alirezarezvani/claude-skills)

## Maintenance

Skills should be updated as:
- New React/TypeScript versions are adopted
- ByteShutter's architecture evolves
- Web standards and best practices change
- New patterns emerge in the codebase

## Contributing

When improving skills:
1. Keep instructions clear and actionable
2. Include code examples that match ByteShutter's style
3. Reference official documentation
4. Add checklists for validation
5. Update this README when adding new skills

## Resources

- [Claude Agent SDK Documentation](https://platform.claude.com/docs/en/agent-sdk/skills)
- [Agent Skills Overview](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Note**: These skills are specifically tailored for ByteShutter's tech stack (React 19, TypeScript, Vite, CSS Modules) and content focus (iOS/Swift, web development, photography). Adapt as needed for other projects.
