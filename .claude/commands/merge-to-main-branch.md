# Merge Worktree Changes to Main Branch

You are tasked with merging code from the current worktree branch into the main project branch. The goal is to update only the files that were actually worked on in this worktree, not to perform a full merge.

## ⚠️ CRITICAL: Lessons Learned from Merge Issues

### Common Pitfalls to Avoid:
1. **Branch Reference Divergence**: The main repository's reference to a worktree branch (e.g., `feature/loader`) may NOT reflect the latest commits made in the worktree
2. **Stale Git References**: Using `git show feature/branch:file` from main repo may retrieve an older version of files
3. **Incomplete Merges**: A merge can appear successful but miss recent changes made during the current session

### Best Practices:
1. **Always commit pending changes in worktree first** before attempting to merge
2. **Use direct file copying** instead of git references when merging from worktree:
   ```bash
   # ✅ GOOD - Direct copy ensures latest version
   cp /path/to/worktree/file.js /path/to/main/file.js

   # ❌ RISKY - May use outdated branch reference
   git show worktree-branch:file.js > file.js
   ```
3. **Verify file contents after merge** - check for expected features/changes:
   ```bash
   # Example verification
   grep -c "expected-feature" merged-file.html
   ```

## Implementation Steps:

1. **Commit all pending changes in worktree**
   - Run `git status` to check for uncommitted changes
   - Commit everything with descriptive message

2. **Identify changed files**
   - From worktree: `git diff --name-only main...HEAD`
   - Save list for reference

3. **Navigate to main repository**
   - Note: Cannot checkout main from within worktree
   - Must use: `cd /path/to/main/repository`

4. **Update main branch**
   - Ensure on main: `git branch --show-current`
   - Pull latest: `git pull origin main`

5. **Copy files directly from worktree filesystem**
   - For each changed file:
     ```bash
     cp /path/to/worktree/file /path/to/main/file
     git add file
     ```
   - DO NOT use `git show worktree-branch:file` as it may be outdated

6. **Verify changes are correct**
   - Check key features are present
   - Compare file sizes if needed
   - Test functionality if applicable

7. **Commit with detailed message**
   - List all files changed
   - Describe key features added/modified

8. **Push to remote**
   - `git push origin main`

9. **Final verification**
   - Confirm files in main branch match worktree
   - Check that all expected changes are present

## Example Verification Commands:
```bash
# After merge, verify specific features are present
echo "Checking for expected changes:"
grep -c "new-feature" file.html
ls -la file.js  # Check file size matches
```

Make sure the implementation is idempotent and safe to run multiple times without overwriting unrelated files. Provide detailed logging so the user can see which files were updated and verify correctness.