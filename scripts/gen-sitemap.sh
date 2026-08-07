#!/usr/bin/env bash
# Regenerate sitemap.xml from what is actually in this repo.
#
# Usage:  ./scripts/gen-sitemap.sh
#
# A page is included when it is a directory with an index.html that does NOT
# carry a `noindex` robots meta tag. That keeps the unlisted demo pages out
# without a hand-maintained exclude list -- the noindex tag in the page is the
# single source of truth, so there is only ever one place to set the intent.
#
# lastmod comes from the last commit that touched the directory, which is the
# honest answer for a repo where committing is deploying. Uncommitted pages
# fall back to today.

set -euo pipefail

BLOG_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$BLOG_DIR"

SITE="https://adamsohn.com"
OUT="sitemap.xml"
TODAY="$(date +%F)"

# lastmod for a path: last commit date, or today if git does not know it yet.
lastmod() {
  git log -1 --format=%cs -- "$1" 2>/dev/null | grep . || echo "$TODAY"
}

{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

  # The homepage.
  printf '  <url>\n    <loc>%s/</loc>\n    <lastmod>%s</lastmod>\n  </url>\n' \
    "$SITE" "$(lastmod index.html)"

  # Every sub-app that wants to be found.
  for f in */index.html; do
    [ -e "$f" ] || continue
    dir="${f%/index.html}"
    if grep -qiE '<meta[^>]+name=["'"'"']robots["'"'"'][^>]*noindex' "$f"; then
      echo "   skipping /$dir/ (noindex)" >&2
      continue
    fi
    printf '  <url>\n    <loc>%s/%s/</loc>\n    <lastmod>%s</lastmod>\n  </url>\n' \
      "$SITE" "$dir" "$(lastmod "$dir")"
  done

  echo '</urlset>'
} > "$OUT"

echo "==> Wrote $OUT with $(grep -c '<loc>' "$OUT") urls"
