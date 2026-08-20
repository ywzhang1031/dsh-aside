import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { apply as applyInvariant } from '../src/invariant.ts'

const manifest = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
) as { name: string }

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
})
