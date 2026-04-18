#!/usr/bin/env bash
# Build a Vite (or similar) project and copy its dist/ into this blog at a given subpath.
#
# Usage:
#   ./scripts/sync-app.sh <source-project-dir> <subpath>
#
# Example:
#   ./scripts/sync-app.sh ~/Projects/agent-capability-threshold/web reliably-incorrect
#
# The source project's vite.config should use `base: './'` so assets use
# relative paths and work at any subpath without rebuilding per-subpath.

set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <source-project-dir> <subpath>" >&2
  exit 1
fi

SRC="$1"
SUBPATH="$2"
BLOG_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$BLOG_DIR/$SUBPATH"

if [ ! -d "$SRC" ]; then
  echo "Source dir does not exist: $SRC" >&2
  exit 1
fi

echo "==> Building in $SRC"
cd "$SRC"
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi
npm run build

if [ ! -d dist ]; then
  echo "Build did not produce a dist/ directory in $SRC" >&2
  exit 1
fi

echo "==> Syncing $SRC/dist -> $DEST"
rm -rf "$DEST"
mkdir -p "$DEST"
cp -R dist/. "$DEST/"

echo "==> Done. $(find "$DEST" -type f | wc -l | tr -d ' ') files in $DEST"
