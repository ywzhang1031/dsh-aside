#!/usr/bin/env bash
# Boot the packed plugins in an isolated, auto-initialized stock DSH profile.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DSH_SMOKE_HOME="$(mktemp -d /tmp/dsh-aside-smoke.XXXXXX)"
DSH_SMOKE_LOG="$DSH_SMOKE_HOME/web.log"
DSH_SMOKE_PID=""

cleanup() {
  if [[ -n "$DSH_SMOKE_PID" ]] && kill -0 "$DSH_SMOKE_PID" 2>/dev/null; then
    kill -INT "$DSH_SMOKE_PID" 2>/dev/null || true
    wait "$DSH_SMOKE_PID" 2>/dev/null || true
  fi
  case "$DSH_SMOKE_HOME" in
    /tmp/dsh-aside-smoke.*) rm -rf -- "$DSH_SMOKE_HOME" ;;
  esac
}
trap cleanup EXIT INT TERM

for command_name in dsh pnpm curl node; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Missing required command: $command_name" >&2
    exit 1
  fi
done

shopt -s nullglob
host_tarballs=("$REPO_ROOT"/dist/dsh-aside-host-*.tgz)
client_tarballs=("$REPO_ROOT"/dist/dsh-client-ui-aside-*.tgz)
public_tarballs=("$REPO_ROOT"/dist/dsh-aside-[0-9]*.tgz)
if [[ ${#host_tarballs[@]} -ne 1 || ${#client_tarballs[@]} -ne 1 || ${#public_tarballs[@]} -ne 1 ]]; then
  echo "Expected exactly one host, client, and public bundle tarball under dist/. Run: pnpm run pack" >&2
  exit 1
fi

# First boot creates the shipped web profile without copying user state.
DSH_HOME="$DSH_SMOKE_HOME" dsh --profile web --dump-default-config >/dev/null
# The public package normally resolves these two exact versions from npm. CI
# redirects them to the freshly packed local tarballs so the one-package path
# is exercised before publication.
DSH_SMOKE_WORKSPACE_CONFIG="$DSH_SMOKE_HOME/profiles/web/pnpm-workspace.yaml" \
DSH_SMOKE_HOST_TARBALL="${host_tarballs[0]}" \
DSH_SMOKE_CLIENT_TARBALL="${client_tarballs[0]}" \
node --input-type=module -e '
  import { readFileSync, writeFileSync } from "node:fs"
  const path = process.env.DSH_SMOKE_WORKSPACE_CONFIG
  const yaml = readFileSync(path, "utf8")
  const overrides = [
    "overrides:",
    `  "dsh-aside-host": "file:${process.env.DSH_SMOKE_HOST_TARBALL}"`,
    `  "dsh-client-ui-aside": "file:${process.env.DSH_SMOKE_CLIENT_TARBALL}"`,
    "",
  ].join("\n")
  writeFileSync(path, `${yaml.trimEnd()}\n${overrides}`)
'
DSH_HOME="$DSH_SMOKE_HOME" dsh plugin --profile web add --silent "${public_tarballs[0]}"

composed="$(DSH_HOME="$DSH_SMOKE_HOME" dsh --profile web --dump-config)"
grep -Fq 'name: dsh-aside-host' <<<"$composed"
grep -Fq 'name: dsh-client-ui-aside' <<<"$composed"

DSH_HOME="$DSH_SMOKE_HOME" dsh --profile web --port 0 >"$DSH_SMOKE_LOG" 2>&1 &
DSH_SMOKE_PID="$!"

web_url=""
for _ in {1..120}; do
  # GitHub Actions may force ANSI color even though stdout is redirected.
  # Strip escape sequences and CR before handing the URL to curl.
  web_url="$(
    sed $'s/\033\\[[0-9;]*[[:alpha:]]//g' "$DSH_SMOKE_LOG" \
      | sed -nE 's/^dsh web: (https?:\/\/[^[:space:]]+).*$/\1/p' \
      | tail -n 1 \
      | tr -d '\r'
  )"
  if [[ -n "$web_url" ]]; then
    break
  fi
  if ! kill -0 "$DSH_SMOKE_PID" 2>/dev/null; then
    cat "$DSH_SMOKE_LOG" >&2
    exit 1
  fi
  sleep 0.25
done
if [[ -z "$web_url" ]]; then
  cat "$DSH_SMOKE_LOG" >&2
  echo "Timed out waiting for stock DSH to print its web URL" >&2
  exit 1
fi

boot_html=""
for _ in {1..40}; do
  if boot_html="$(curl --fail --silent --show-error "$web_url/")"; then
    break
  fi
  sleep 0.25
done
grep -Fq 'dsh-client-ui-aside/client.js' <<<"$boot_html"

DSH_HOME="$DSH_SMOKE_HOME" node "$REPO_ROOT/scripts/uninstall.mjs" --profile web
after_uninstall="$(DSH_HOME="$DSH_SMOKE_HOME" dsh --profile web --dump-config)"
if grep -Fq 'dsh-aside' <<<"$after_uninstall" \
  || grep -Fq 'dsh-aside-host' <<<"$after_uninstall" \
  || grep -Fq 'dsh-client-ui-aside' <<<"$after_uninstall"; then
  echo "dsh-aside bundles remain in the smoke profile after uninstall" >&2
  exit 1
fi

echo "Stock DSH install, cold-boot, and uninstall smoke passed: $web_url (dsh $(dsh --version))"
