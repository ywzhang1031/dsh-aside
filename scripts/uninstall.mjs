#!/usr/bin/env node

import { spawnSync } from 'node:child_process'

const PUBLIC_PACKAGE = 'dsh-aside'
const LEGACY_PACKAGES = [
  'dsh-client-ui-aside',
  'dsh-aside-host',
]
const PACKAGES = [PUBLIC_PACKAGE, ...LEGACY_PACKAGES]

function usage() {
  console.log('Usage: node scripts/uninstall.mjs [--profile <name>]')
  console.log('Removes the dsh-aside bundles only; existing session logs are preserved.')
}

function fail(message) {
  console.error(`dsh-aside uninstall: ${message}`)
  process.exit(1)
}

let profile = 'web'
const args = process.argv.slice(2)
for (let index = 0; index < args.length; index += 1) {
  const arg = args[index]
  if (arg === '--help' || arg === '-h') {
    usage()
    process.exit(0)
  }
  if (arg === '--profile' || arg === '-p') {
    const value = args[index + 1]
    if (value === undefined || value.startsWith('-')) fail(`${arg} requires a profile name`)
    profile = value
    index += 1
    continue
  }
  fail(`unknown argument ${JSON.stringify(arg)}`)
}

const listed = spawnSync(
  'dsh',
  ['plugin', '--profile', profile, 'list', '--depth', '0', '--json'],
  { encoding: 'utf8' },
)
if (listed.error?.code === 'ENOENT') fail('dsh was not found on PATH')
if (listed.status !== 0) {
  process.stderr.write(listed.stderr ?? '')
  fail(`could not inspect profile ${JSON.stringify(profile)}`)
}

let inventory
try {
  inventory = JSON.parse(listed.stdout)
} catch {
  fail(`profile ${JSON.stringify(profile)} returned invalid package inventory`)
}

const root = Array.isArray(inventory) ? inventory[0] : inventory
const dependencies = root?.dependencies ?? {}
const installed = PACKAGES.filter(packageName => dependencies[packageName] !== undefined)

if (installed.length === 0) {
  console.log(`dsh-aside is not installed in profile ${JSON.stringify(profile)}.`)
  process.exit(0)
}

console.log(`Removing dsh-aside from profile ${JSON.stringify(profile)}:`)
for (const packageName of installed) console.log(`  - ${packageName}`)

const removed = spawnSync(
  'dsh',
  ['plugin', '--profile', profile, 'remove', ...installed],
  { stdio: 'inherit' },
)
if (removed.error?.code === 'ENOENT') fail('dsh was not found on PATH')
if (removed.status !== 0) fail('dsh plugin remove failed')

console.log('Uninstall complete. Restart any running `dsh web` process.')
console.log('Existing main and aside session logs were not deleted.')
