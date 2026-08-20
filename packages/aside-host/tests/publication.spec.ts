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
    expect(TYPERT.invocations.map(invocation => invocation.id)).toEqual([
      `${manifest.name}#aside/create`,
      `${manifest.name}#aside/list`,
    ])
  })

  it('publishes the create result that create actually returns', () => {
    const create = TYPERT.invocations[0]!
    expect(create.result.typeSymbol).toBe(`${manifest.name}/types#AsideCreateResult`)
    const parsed = create.result.schema.safeParse({
      record: {
        schemaVersion: 1,
        parentSessionId: 'parent',
        subSessionId: 'aside-test',
        anchor: {
          messageId: 'm1',
          exact: 'text',
          prefix: '',
          suffix: '',
          occurrence: 1,
          startOffset: 0,
        },
        createdAt: 1,
        updatedAt: 1,
      },
    })
    expect(parsed.success).toBe(true)
  })

  it('publishes the list result that list actually returns', () => {
    const list = TYPERT.invocations[1]!
    expect(list.result.typeSymbol).toBe(`${manifest.name}/types#AsideListResult`)
    expect(list.result.schema.safeParse({ records: [] }).success).toBe(true)
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
