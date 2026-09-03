#!/bin/sh
# js13k build + size gate. Fails loudly over 13312 bytes.
# Usage: sh build.sh   (add advzip + roadroller to PATH for the last ~1.5KB)
set -e
SRC=index.html
OUT=dist
LIMIT=13312

rm -rf $OUT game.zip && mkdir -p $OUT

# 1. pull the inline script out, minify it, put it back
sed -n '/<script>/,/<\/script>/p' $SRC | sed '1d;$d' > $OUT/g.js
npx --yes esbuild@0.23.0 --minify $OUT/g.js --outfile=$OUT/g.min.js >/dev/null 2>&1

# 2. optional roadroller pass -- only wins above ~6KB of minified JS, so A/B it
if [ "$1" = "--roll" ]; then
  npx --yes roadroller@2.1.0 $OUT/g.min.js -o $OUT/g.packed.js >/dev/null 2>&1
  JS=$OUT/g.packed.js
else
  JS=$OUT/g.min.js
fi

# 3. reassemble a single self-contained index.html
awk -v js="$JS" '
  /<script>/ {print "<script>"; while((getline l < js) > 0) print l; skip=1; next}
  /<\/script>/ {if(skip){print "</script>"; skip=0; next}}
  !skip
' $SRC > $OUT/index.html

# 4. zip and gate
(cd $OUT && zip -9 -q ../game.zip index.html)
command -v advzip >/dev/null 2>&1 && advzip -z -4 game.zip >/dev/null 2>&1 || echo "  (advzip not installed - typically saves ~800-1000 bytes)"

B=$(wc -c < game.zip)
echo "$B / $LIMIT bytes  ($((LIMIT - B)) free)"
[ "$B" -le "$LIMIT" ] || { echo "OVER LIMIT"; exit 1; }
