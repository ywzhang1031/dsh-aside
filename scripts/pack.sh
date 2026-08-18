#!/usr/bin/env bash
# Pack the two plugin packages into dist/*.tgz for `dsh plugin add`.
# Usage: bash scripts/pack.sh
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p dist
for pkg in packages/aside-host packages/client-ui-aside; do
  (cd "$pkg" && npm pack --silent --pack-destination ../../dist)
done
echo "Packed:"
ls -1 dist/*.tgz
