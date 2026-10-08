---
name: sync-ai-config
description: "Keep CLAUDE.md and AGENTS.md identical by copying one over the other. Use after editing either file. The user names the source: claude (CLAUDE.md is source) or agents (AGENTS.md is source)."
argument-hint: "claude | agents"
---

# Sync AI Config Files

`CLAUDE.md` (read by Claude Code) and `AGENTS.md` (read by Mistral Vibe and other agents) must stay identical.
This skill overwrites the destination file with the source file's content.

## Steps

1. **Determine the source of truth** from the user's argument or message
   - `claude` → source = `CLAUDE.md`, destination = `AGENTS.md`
   - `agents` → source = `AGENTS.md`, destination = `CLAUDE.md`
   - Anything else, or nothing → ask the user: "Which file is the source of truth? (claude / agents)"

2. **Check the source exists** (`test -f <source>`)

3. **Copy it byte-for-byte** with the shell, from the repository root:
   ```bash
   cp CLAUDE.md AGENTS.md   # source = claude
   cp AGENTS.md CLAUDE.md   # source = agents
   ```
   Do NOT retype, summarise or paraphrase the content.

4. **Verify**: `cmp CLAUDE.md AGENTS.md` must print nothing

5. **Confirm**: output one line: `Synced <source-path> → <destination-path>`

## Rules

- Never modify content while syncing — this is a pure copy operation
- If the **source** file does not exist, stop and tell the user. A missing destination file is normal — just copy it.

## Path Resolution

All paths are relative to the repository root. Resolve with `git rev-parse --show-toplevel` if needed.
