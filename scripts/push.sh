#!/bin/bash
# Run this once to push all current commits to GitHub.
set -e
echo "→ Pushing all commits to origin/main..."
git push origin main
echo "✓ Done."
