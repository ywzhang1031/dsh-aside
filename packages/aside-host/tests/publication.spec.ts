import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { apply as applyInvariant } from '../src/invariant.ts'
import { TYPERT } from '../lib/typert.host.js'
import { TYPERT_REMOTE } from '../lib/typert.remote-client.js'

const manifest = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
) as { name: string }

describe('published host contract', () => {
  it('owns its generated Typert manifests and symbols', () => {
    expect(TYPERT.package).toBe(manifest.name)
    expect(TYPERT_REMOTE.package).toBe(manifest.name)
    expect(TYPERT_REMOTE.descriptors).toEqual(TYPERT.invocations)

    const invocation = TYPERT.invocations[0]!
    expect(invocation.id).toBe(`${manifest.name}#aside/create`)
    expect(invocation.result.typeSymbol).toBe(`${manifest.name}/types#AsideCreateResult`)
  })

  it('publishes the gateway result that create actually returns', () => {
    const resultSchema = TYPERT.invocations[0]!.result.schema
    expect(resultSchema.safeParse({ sessionId: 'aside-test' }).success).toBe(true)
  })

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
