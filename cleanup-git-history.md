# How to Clean Up Git Commit History

This guide explains how to squash all commits in a Git repository into a single commit, effectively cleaning up the change history so that no intermediate changes are visible.

## Warning

This is a destructive operation that permanently removes commit history. It cannot be undone. Make sure you have backups of important data and understand the consequences before proceeding.

## Prerequisites

- Git installed and configured
- A Git repository with commits to clean up
- Push access to the remote repository (if applicable)

## Steps

1. **Check the current commit history** to understand what you're working with:
   ```
   git log --oneline
   ```
   This shows all commits in a compact format.

2. **Identify the initial commit hash**. This is usually the oldest commit in the repository. Note down this hash (e.g., `a1520fc`).

3. **Reset soft to the initial commit**. This unstages all commits but keeps the changes staged:
   ```
   git reset --soft <initial-commit-hash>
   ```
   Replace `<initial-commit-hash>` with the hash from step 2.

4. **Amend the initial commit** to include all the staged changes:
   ```
   git commit --amend --no-edit
   ```
   This keeps the original commit message.

5. **Force push the cleaned history** to the remote repository (if you have one):
   ```
   git push --force origin main
   ```
   Replace `main` with your default branch name if different.

## Verification

Run `git log --oneline` again. You should now see only one commit in the history.

## Alternative Approach

If you want to start completely fresh without any history:

1. Create a new orphan branch:
   ```
   git checkout --orphan new-branch
   ```

2. Add all files:
   ```
   git add .
   ```

3. Commit:
   ```
   git commit -m "Initial commit"
   ```

4. Delete the old branch and rename:
   ```
   git branch -D main
   git branch -m main
   ```

5. Force push:
   ```
   git push --force origin main
