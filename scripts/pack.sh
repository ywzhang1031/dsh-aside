#!/usr/bin/env bash
# Pack the two runtime packages and the public one-package bundle into dist/*.tgz.
# Usage: bash scripts/pack.sh
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p dist
# Remove only tarballs owned by this repository so release assets cannot mix versions.
rm -f \
  dist/dsh-aside-*.tgz \
  dist/dsh-client-ui-aside-*.tgz
for pkg in packages/aside-host packages/client-ui-aside; do
  (cd "$pkg" && npm pack --silent --pack-destination ../../dist)
done
(cd packages/aside && pnpm pack --pack-destination ../../dist >/dev/null)
echo "Packed:"
ls -1 dist/*.tgz
