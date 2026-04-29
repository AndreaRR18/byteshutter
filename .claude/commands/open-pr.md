---
description: Push the current branch and open a pull request on GitHub. Optional argument overrides the PR title.
argument-hint: [optional PR title]
allowed-tools: Bash, Read
---

# Open Pull Request

Push the current branch to origin and create a GitHub pull request.

## Steps

1. **Check current branch** — confirm you are not on `main` or `master`. If you are, stop and tell the user to switch to a feature branch first.

2. **Check for unpushed commits**
   ```bash
   git log origin/$(git branch --show-current)..HEAD --oneline 2>/dev/null || git log HEAD --oneline -5
   ```

3. **Push the branch**
   ```bash
   git push -u origin $(git branch --show-current)
   ```

4. **Determine the PR title**
   - If `$ARGUMENTS` is provided, use it as the title
   - Otherwise, use the most recent commit subject as the title

5. **Build the PR body** from the commit log since the branch diverged from main:
   ```bash
   git log main..HEAD --oneline
   ```
   Summarise the changes into 2-3 bullet points.

6. **Create the PR**
   ```bash
   gh pr create --title "<title>" --body "$(cat <<'EOF'
   ## Summary
   <2-3 bullet points from commit log>

   ## Test Plan
   - [ ] Verify changes look correct on the branch
   EOF
   )"
   ```

7. **Output the PR URL** so the user can open it.
