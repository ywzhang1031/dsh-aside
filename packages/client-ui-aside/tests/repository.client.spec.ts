/**
 * Aside repository tests: Host-backed refresh, optimistic add, superseded
 * refresh discard, find semantics, and the absence of any localStorage
 * dependency.
 */

import { describe, expect, it, vi } from 'vitest'
import type { AsideRecord } from 'dsh-aside-host/types'
import { AsideRepository, asideText } from '../src/client/repository.ts'

function record(overrides: Partial<AsideRecord> = {}): AsideRecord {
  return {
    schemaVersion: 1,
    parentSessionId: 's1',
    subSessionId: 'sub-1',
    anchor: { messageId: 'm1', exact: 'deepseek harness', prefix: '', suffix: '', occurrence: 1, startOffset: 0 },
    createdAt: 1,
    updatedAt: 1,
    ...overrides,
  }
}

function remote(records: AsideRecord[] = []) {
  const list = vi.fn(() => Promise.resolve({ ok: true, value: { records } }))
  return { list, face: { list } }
}

describe('asideText', () => {
  it('whitespace-normalizes and truncates the anchor text', () => {
    expect(asideText(record({ anchor: { messageId: null, exact: '  deepseek   harness ', prefix: '', suffix: '', occurrence: null, startOffset: null } })))
      .toBe('deepseek harness')
    expect(asideText(record({ anchor: { messageId: null, exact: 'x'.repeat(200), prefix: '', suffix: '', occurrence: null, startOffset: null } })).length)
      .toBe(61)
  })
})

describe('AsideRepository', () => {
  it('loads records from the Host remote for the current parent session', async () => {
    const { face } = remote([record()])
    const repo = new AsideRepository(face)
    await repo.refresh('s1')
    expect(repo.list()).toHaveLength(1)
    expect(repo.list()[0]).toMatchObject({ subSessionId: 'sub-1', parentSessionId: 's1' })
    expect(face.list).toHaveBeenCalledWith({ parentSessionId: 's1' })
  })

  it('discards a superseded refresh after a session switch', async () => {
    let resolveFirst!: (value: { ok: boolean; value?: { records: AsideRecord[] } }) => void
    const list = vi.fn((request: { parentSessionId: string }) => request.parentSessionId === 's1'
      ? new Promise<{ ok: boolean; value?: { records: AsideRecord[] } }>(resolve => { resolveFirst = resolve })
      : Promise.resolve({ ok: true, value: { records: [record({ parentSessionId: 's2', subSessionId: 'sub-2' })] } }))
    const repo = new AsideRepository({ list })
    const first = repo.refresh('s1')
    await repo.refresh('s2')
    resolveFirst({ ok: true, value: { records: [record()] } })
    await first
    expect(repo.list()).toHaveLength(1)
    expect(repo.list()[0]!.subSessionId).toBe('sub-2')
  })

  it('does not clobber a record added while a slow refresh is in flight', async () => {
    let resolveList!: (value: { ok: boolean; value?: { records: AsideRecord[] } }) => void
    const list = vi.fn(() => new Promise<{ ok: boolean; value?: { records: AsideRecord[] } }>(resolve => { resolveList = resolve }))
    const repo = new AsideRepository({ list })
    const refreshing = repo.refresh('s1')
    repo.add(record()) // bumps generation, invalidating the in-flight refresh
    resolveList({ ok: true, value: { records: [] } }) // stale empty snapshot
    await refreshing
    expect(repo.list()).toHaveLength(1)
    expect(repo.list()[0]!.subSessionId).toBe('sub-1')
  })

  it('clears on a failed list (and the repository has no localStorage code path)', async () => {
    const list = vi.fn(() => Promise.resolve({ ok: false, error: { message: 'boom' } }))
    const repo = new AsideRepository({ list })
    await repo.refresh('s1')
    expect(repo.list()).toEqual([])
  })

  it('adds a freshly created record into the cache', () => {
    const repo = new AsideRepository({ list: vi.fn(() => Promise.resolve({ ok: true, value: { records: [] } })) })
    void repo.refresh('s1')
    repo.add(record())
    expect(repo.list()).toHaveLength(1)
    // Re-adding the same record replaces, never duplicates.
    repo.add(record({ updatedAt: 2 }))
    expect(repo.list()).toHaveLength(1)
    expect(repo.list()[0]!.updatedAt).toBe(2)
  })

  it('clears records when no main session is selected', async () => {
    const { face } = remote([record()])
    const repo = new AsideRepository(face)
    await repo.refresh('s1')
    repo.clear()
    expect(repo.list()).toEqual([])
    repo.add(record())
    expect(repo.list()).toEqual([])
  })

  it('finds by full anchor identity and by sub-session id', () => {
    const repo = new AsideRepository({ list: vi.fn(() => Promise.resolve({ ok: true, value: { records: [] } })) })
    void repo.refresh('s1')
    const base = record()
    repo.add(base)
    expect(repo.find('s1', base.anchor)).toBeDefined()
    expect(repo.find('s1', { ...base.anchor, exact: 'harness' })).toBeUndefined()
    expect(repo.find('s1', { ...base.anchor, occurrence: 2 })).toBeUndefined()
    expect(repo.findSub('sub-1')).toMatchObject({ subSessionId: 'sub-1' })
  })

  it('notifies subscribers on refresh and add', async () => {
    const { face } = remote([record()])
    const repo = new AsideRepository(face)
    const listener = vi.fn()
    repo.subscribe(listener)
    await repo.refresh('s1')
    repo.add(record({ subSessionId: 'sub-2' }))
    expect(listener).toHaveBeenCalledTimes(2)
  })
})
