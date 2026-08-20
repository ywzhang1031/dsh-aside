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

for command_name in dsh pnpm curl; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Missing required command: $command_name" >&2
    exit 1
  fi
done

shopt -s nullglob
host_tarballs=("$REPO_ROOT"/dist/ywzhang1031-dsh-aside-host-*.tgz)
client_tarballs=("$REPO_ROOT"/dist/ywzhang1031-dsh-client-ui-aside-*.tgz)
if [[ ${#host_tarballs[@]} -ne 1 || ${#client_tarballs[@]} -ne 1 ]]; then
  echo "Expected exactly one host and one client tarball under dist/. Run: pnpm run pack" >&2
  exit 1
fi

# First boot creates the shipped web profile without copying user state.
DSH_HOME="$DSH_SMOKE_HOME" dsh --profile web --dump-default-config >/dev/null
DSH_HOME="$DSH_SMOKE_HOME" dsh plugin --profile web add --silent "${host_tarballs[0]}"
DSH_HOME="$DSH_SMOKE_HOME" dsh plugin --profile web add --silent "${client_tarballs[0]}"

composed="$(DSH_HOME="$DSH_SMOKE_HOME" dsh --profile web --dump-config)"
grep -Fq "name: '@ywzhang1031/dsh-aside-host'" <<<"$composed"
grep -Fq "name: '@ywzhang1031/dsh-client-ui-aside'" <<<"$composed"

DSH_HOME="$DSH_SMOKE_HOME" dsh --profile web --port 0 >"$DSH_SMOKE_LOG" 2>&1 &
DSH_SMOKE_PID="$!"

web_url=""
for _ in {1..120}; do
  web_url="$(sed -n 's/^dsh web: //p' "$DSH_SMOKE_LOG" | tail -n 1)"
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
grep -Fq '@ywzhang1031/dsh-client-ui-aside/client.js' <<<"$boot_html"

echo "Stock DSH smoke test passed: $web_url (dsh $(dsh --version))"
