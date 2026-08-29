#!/bin/bash
# Publish THIS folder to https://github.com/NaveenKapur/thevegclub2 (branch main).
#
# Usage — from inside your project folder:
#     cd ~/Downloads/"tvc 2"
#     bash publish-tvc2.sh
#
# Uploads the folder exactly as it is now. Your files are the source of truth:
# whatever is here becomes the new site. Remote history is kept (your upload
# lands as a new commit on top of it), so no force-push is needed.

set -euo pipefail

REPO="https://github.com/NaveenKapur/thevegclub2.git"
BRANCH="main"
cd "$(pwd)"

echo "==> Publishing folder: $(pwd)"
[ -f package.json ] || { echo "ERROR: no package.json here — are you in the project folder?"; exit 1; }

# --- 1. make sure this folder is a git repo pointed at the right remote -------
if [ ! -d .git ]; then
  echo "==> Not a git repo yet — initialising"
  git init -q
fi
if git remote get-url origin >/dev/null 2>&1; then
  CURRENT="$(git remote get-url origin)"
  if [ "$CURRENT" != "$REPO" ]; then
    echo "==> Repointing origin: $CURRENT  ->  $REPO"
    git remote set-url origin "$REPO"
  fi
else
  git remote add origin "$REPO"
fi

# --- 2. never publish junk or secrets ----------------------------------------
touch .gitignore
for entry in node_modules .next .env .env.local .env.production "*.log" .DS_Store; do
  grep -qxF "$entry" .gitignore || echo "$entry" >> .gitignore
done

# --- 3. base the upload on the current remote tip ----------------------------
echo "==> Fetching current remote state"
git fetch -q origin "$BRANCH"
PREV_HEAD="$(git rev-parse --short HEAD 2>/dev/null || echo none)"
echo "==> Remote is at: $(git log --oneline -1 FETCH_HEAD)"
[ "$PREV_HEAD" = none ] || echo "==> (your local HEAD was $PREV_HEAD — recoverable via 'git reflog')"

git reset --soft FETCH_HEAD
git add -A

# --- 4. show what actually changes, then confirm -----------------------------
if git diff --cached --quiet; then
  echo "==> This folder is already identical to the published site. Nothing to upload."
  exit 0
fi

echo
echo "==> Changes that will go live:"
git diff --cached --stat
echo

if [ -d node_modules ]; then
  echo "==> Verifying the build (npm run build)"
  npm run build
  echo "==> Build OK"
else
  echo "==> Skipping build check (no node_modules here). Run 'npm install' first if you want it verified."
fi

echo
echo "NOTE: thevegclub2 is a PUBLIC repository — everything above becomes public."
read -r -p "Upload to thevegclub2? [y/N] " ok
[[ "$ok" =~ ^[Yy]$ ]] || { echo "Aborted — nothing was uploaded."; exit 0; }

# --- 5. publish ---------------------------------------------------------------
git commit -q -m "Update The Veg Club site"
git push origin HEAD:"$BRANCH"

echo
echo "==> Done. Published commit:"
git ls-remote --heads origin "$BRANCH"
