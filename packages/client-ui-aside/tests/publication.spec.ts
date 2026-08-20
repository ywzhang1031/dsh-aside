import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { apply as applyInvariant } from '../src/invariant.ts'

const manifest = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
) as { name: string }

const publicManifest = JSON.parse(
  readFileSync(new URL('../../aside/package.json', import.meta.url), 'utf8'),
) as {
  name: string
  dependencies?: Record<string, string>
  dsh?: { bundle?: { patch?: string } }
}

describe('published client contract', () => {
  it('registers invariants under the published package name', async () => {
    const registered: string[] = []
    const ctx = {
      invariants: {
        register(packageName: string) {
          registered.push(packageName)
          return () => {}
        },
      },
    }

    await applyInvariant(ctx as never)
    expect(registered).toEqual([manifest.name])
  })

  it('does not publish build-machine paths in virtual CSS module ids', () => {
    const bundle = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8')
    expect(bundle).not.toMatch(/dsh-css:(?:\/|[A-Za-z]:[\\/])/)
  })

  it('ships one public bundle that owns both runtime packages', () => {
    const patch = readFileSync(new URL('../../aside/cordis.patch.yml', import.meta.url), 'utf8')
    expect(publicManifest.name).toBe('dsh-aside')
    expect(publicManifest.dsh?.bundle?.patch).toBe('./cordis.patch.yml')
    expect(publicManifest.dependencies).toEqual({
      'dsh-aside-host': 'workspace:0.1.0',
      'dsh-client-ui-aside': 'workspace:0.1.0',
    })
    expect(patch).toContain("name: 'dsh-aside-host'")
    expect(patch).toContain("name: 'dsh-client-ui-aside'")
  })
})
