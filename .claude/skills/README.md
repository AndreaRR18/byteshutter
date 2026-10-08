# ByteShutter Agent Skills

Project skills for the ByteShutter blog: a vanilla HTML/CSS/TypeScript site (no framework, no bundler) with a "Darkroom" design, Markdown articles converted to JSON at build time, and hash-routed article pages. Each skill encodes how this repo works so changes stay consistent.

The skills follow the [Agent Skills](https://agentskills.io) format and work in both **Claude Code** and **Mistral Vibe**.

## Available Skills

| Skill | Use it when |
|---|---|
| [`byteshutter-consistency`](byteshutter-consistency/SKILL.md) | Before adding or changing any HTML/CSS: Darkroom tokens, viewfinder motif, motion, dark/light themes, breakpoints, what not to do |
| [`css-standards`](css-standards/SKILL.md) | Before writing or reviewing CSS: specificity, naming, Grid/Flexbox, custom properties, dark mode, performance |
| [`html-standards`](html-standards/SKILL.md) | Before writing or reviewing HTML: semantics, WCAG 2.2, responsive images, document hygiene |
| [`blog-article-expert`](blog-article-expert/SKILL.md) | Creating or editing articles in `articles/`: frontmatter, slugs, frame numbers, images, tags |
| [`typescript-master`](typescript-master/SKILL.md) | TypeScript in `src/ts/` and `scripts/`: typing the DOM and fetched JSON, `tsconfig` questions, type errors |
| [`code-reviewer`](code-reviewer/SKILL.md) | Reviewing a diff or PR: type safety, XSS, project conventions, build/CI impact |
| [`web-accessibility-seo-expert`](web-accessibility-seo-expert/SKILL.md) | Accessibility audits and SEO for the static, hash-routed site |
| [`open-pr`](open-pr/SKILL.md) | Pushing the current branch and opening a GitHub pull request (`/open-pr [title]`) |
| [`sync-ai-config`](sync-ai-config/SKILL.md) | After editing `CLAUDE.md` or `AGENTS.md`: copies one over the other so they stay identical |

## Using Skills in Each Agent

Both agents load a skill automatically when the task matches its `description`, and both let you call one by name:

| | Claude Code | Mistral Vibe |
|---|---|---|
| Project context file | `CLAUDE.md` | `AGENTS.md` |
| Skills directory it reads | `.claude/skills/` | `.agents/skills/` (or `.vibe/skills/`) |
| Invoke explicitly | `/byteshutter-consistency` | `/byteshutter-consistency` |

Vibe only loads project skills and `AGENTS.md` from a **trusted folder**; accept the trust prompt the first time you run `vibe` here.

Skills can be combined. A new page, for example, calls for `byteshutter-consistency`, `html-standards` and `css-standards`.

## Layout: One Source, Two Paths

`.claude/skills/` is the real directory. `.agents/skills` is a **symlink** to it (`../.claude/skills`), because Vibe does not read `.claude/`. Edit skills under `.claude/skills/`; never keep two copies.

```
.claude/skills/<name>/SKILL.md     ← real files (Claude Code reads here)
.agents/skills -> ../.claude/skills ← symlink (Vibe reads here)
```

## Writing a Portable Skill

Each skill is a directory with a `SKILL.md` (exactly that spelling: Linux and CI are case-sensitive) that starts with YAML frontmatter:

```markdown
---
name: skill-name
description: "What it does and when to use it. Quote this value."
---
```

Rules that keep it working in both agents:

- **Valid YAML.** Vibe parses frontmatter strictly. A description containing `: ` (colon + space), `#` or a leading quote must be wrapped in quotes, otherwise Vibe skips the skill
- **`name`** is required, lowercase letters, digits and hyphens only, at most 64 characters, and equal to the directory name
- **`description`** is required and at most 1024 characters. Say what the skill does *and when to use it*; it is what both agents match against
- **Optional fields** both understand: `license`, `compatibility`, `metadata`, `user-invocable`, `disable-model-invocation`. `argument-hint` is Claude-only and harmless in Vibe
- **No tool allow-lists.** `allowed-tools` uses different tool names in each agent (`Bash` vs `bash`, `Read` vs `read_file`), so leave it out
- **No agent-specific tool names in the body.** Write "run `npm run compile`" or "read the file", not "use the Bash tool"
- **No `$ARGUMENTS` placeholders.** Say "if the user gave a title, use it": Claude appends arguments to the skill and Vibe adds them as extra instructions
- **Slash commands are skills.** Vibe has no `.claude/commands/` equivalent, so command-style workflows (like `open-pr`) live here

## Related AI Files

- [`CLAUDE.md`](../../CLAUDE.md) and [`AGENTS.md`](../../AGENTS.md): project context for AI agents. They must stay identical; run `sync-ai-config` after editing either.
- [`rules/`](../../rules): `blog_style_guidelines.md` (Darkroom summary) and `typescript-guidelines.md`.
- [`docs/superpowers/`](../../docs/superpowers): design specs and implementation plans (history of the Darkroom restyle).

## Maintenance

Update the affected skill when:

- the build, tsconfig or CI changes (`package.json`, `tsconfig*.json`, `.github/workflows/`)
- design tokens or components change (`css/tokens.css`, `byteshutter-consistency`)
- the article pipeline changes (`scripts/ConvertArticlesToJSON/`, `src/ts/feed.ts`, `src/ts/article.ts`)

When adding a skill: create `.claude/skills/<name>/SKILL.md` with frontmatter, add a row to the table above and to the skills table in `CLAUDE.md`, then run `sync-ai-config`. The symlink picks it up for Vibe automatically.

## Resources

- [Agent Skills format](https://agentskills.io)
- [Claude Code skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)
- [Mistral Vibe skills](https://docs.mistral.ai/vibe/code/cli/skills)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [MDN Web Docs](https://developer.mozilla.org/)
