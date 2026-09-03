#!/bin/sh
# js13k build + size gate. Fails loudly over 13312 bytes.
# Usage: sh build.sh   (npm i first; toolchain is in devDependencies)
set -e
exec node build.mjs "$@"
