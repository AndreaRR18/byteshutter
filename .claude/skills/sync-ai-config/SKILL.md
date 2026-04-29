---
name: sync-ai-config
description: Copy one file over the other to keep CLAUDE.md and AGENTS.md identical. Use after updating either file. Accepts optional argument: "claude" (CLAUDE.md is source) or "agents" (AGENTS.md is source).
---

# Sync AI Config Files

`CLAUDE.md` (Claude Code) and `AGENTS.md` (Mistral) must stay identical.
This skill overwrites the destination file with the source file's content.

## Steps

1. **Determine the source of truth**
   - Argument `claude` → source = `CLAUDE.md`, destination = `AGENTS.md`
   - Argument `agents` → source = `AGENTS.md`, destination = `CLAUDE.md`
   - No argument → ask the user: "Which file is the source of truth? (claude / agents)"

2. **Read the source file** using the Read tool

3. **Overwrite the destination file** with the exact same content using the Write tool
   - Do NOT summarise or paraphrase — copy byte-for-byte

4. **Confirm**: output one line: `Synced <source-path> → <destination-path>`

## Rules

- Never modify content while syncing — this is a pure copy operation
- Always read the source file fresh before writing — do not rely on memory
- If the **source** file does not exist, stop and tell the user. A missing destination file is normal — just write it.
- If the argument is anything other than `claude` or `agents`, treat it as if no argument was given and ask the user.

## Path Resolution

All paths are relative to the repository root. Resolve with `git rev-parse --show-toplevel` if needed.
