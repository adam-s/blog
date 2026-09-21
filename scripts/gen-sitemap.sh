#!/usr/bin/env bash
# Regenerate sitemap.xml from what is actually in this repo.
#
# Usage:  ./scripts/gen-sitemap.sh
#
# A page is included when it is a directory with an index.html that does NOT
# carry a `noindex` robots meta tag. Top-level directories are always scanned;
# a nested page (e.g. /algoviz/cheat-sheet/) is included only when the
# homepage links to it, so a sub-app's internal pages stay out unless they
# are promoted on index.html. That keeps the unlisted demo pages out
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

# Nested pages the homepage links to, as dir paths without slashes at the ends.
nested_linked() {
  grep -oE 'href="/[^"#?]+/"' index.html | sed -E 's#^href="/##; s#/"$##' \
    | grep / | sort -u || true
}

# Emit one <url>, unless the page opts out with noindex.
emit() {
  local dir="$1" f="$1/index.html"
  [ -e "$f" ] || return 0
  if grep -qiE '<meta[^>]+name=["'"'"']robots["'"'"'][^>]*noindex' "$f"; then
    echo "   skipping /$dir/ (noindex)" >&2
    return 0
  fi
  printf '  <url>\n    <loc>%s/%s/</loc>\n    <lastmod>%s</lastmod>\n  </url>\n' \
    "$SITE" "$dir" "$(lastmod "$dir")"
}

{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

  # The homepage.
  printf '  <url>\n    <loc>%s/</loc>\n    <lastmod>%s</lastmod>\n  </url>\n' \
    "$SITE" "$(lastmod index.html)"

  # Every sub-app that wants to be found, then the nested pages the homepage
  # promotes, sorted together so each nested page sits under its parent.
  { for f in */index.html; do echo "${f%/index.html}"; done; nested_linked; } \
    | sort -u | while read -r dir; do emit "$dir"; done

  echo '</urlset>'
} > "$OUT"

echo "==> Wrote $OUT with $(grep -c '<loc>' "$OUT") urls"
