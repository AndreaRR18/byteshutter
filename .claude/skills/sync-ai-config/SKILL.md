---
name: sync-ai-config
description: Sync CLAUDE.MD and AGENTS.md so they stay identical. Use after updating either file. Accepts optional argument: "claude" (CLAUDE.MD is source) or "agents" (AGENTS.md is source).
---

# Sync AI Config Files

`CLAUDE.MD` (Claude Code) and `AGENTS.md` (Mistral) must stay identical.
This skill overwrites the destination file with the source file's content.

## Steps

1. **Determine the source of truth**
   - Argument `claude` → source = `CLAUDE.MD`, destination = `AGENTS.md`
   - Argument `agents` → source = `AGENTS.md`, destination = `CLAUDE.MD`
   - No argument → ask the user: "Which file is the source of truth? (claude / agents)"

2. **Read the source file** using the Read tool

3. **Overwrite the destination file** with the exact same content using the Write tool
   - Do NOT summarise or paraphrase — copy byte-for-byte

4. **Confirm**: output one line: `Synced <source-path> → <destination-path>`

## Rules

- Never modify content while syncing — this is a pure copy operation
- Always read the source file fresh before writing — do not rely on memory
- If either file does not exist, stop and tell the user
