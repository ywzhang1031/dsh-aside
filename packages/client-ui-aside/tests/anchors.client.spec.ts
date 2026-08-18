/**
 * Anchor ledger tests over an in-memory Storage fake: persistence round-trip,
 * corruption degradation, idempotent ensure, and subscription semantics.
 */

import { describe, expect, it, vi } from 'vitest'
import { AnchorStore } from '../src/client/anchors.ts'

class FakeStorage implements Storage {
  private map = new Map<string, string>()
  get length(): number { return this.map.size }
  clear(): void { this.map.clear() }
  getItem(key: string): string | null { return this.map.get(key) ?? null }
  key(index: number): string | null { return [...this.map.keys()][index] ?? null }
  removeItem(key: string): void { this.map.delete(key) }
  setItem(key: string, value: string): void { this.map.set(key, value) }
}

function record(overrides: Partial<Parameters<AnchorStore['ensure']>[0]> = {}) {
  return {
    sessionId: 's1',
    messageId: 'm1',
    text: 'deepseek harness',
    subSessionId: 'sub-1',
    ...overrides,
  }
}

describe('AnchorStore', () => {
  it('persists and reloads records across instances', () => {
    const storage = new FakeStorage()
    const first = new AnchorStore(storage)
    first.ensure(record())
    const second = new AnchorStore(storage)
    expect(second.list()).toHaveLength(1)
    expect(second.list()[0]).toMatchObject({ sessionId: 's1', subSessionId: 'sub-1' })
  })

  it('degrades to empty on corrupted persisted state', () => {
    const storage = new FakeStorage()
    storage.setItem('dsh-aside-anchors', '{not json')
    expect(new AnchorStore(storage).list()).toEqual([])
    storage.setItem('dsh-aside-anchors', JSON.stringify([{ nope: 1 }, null, 'x']))
    expect(new AnchorStore(storage).list()).toEqual([])
  })

  it('ensure is idempotent per (session, message, text) and returns the existing record', () => {
    const store = new AnchorStore(new FakeStorage())
    const created = store.ensure(record())
    const again = store.ensure(record())
    expect(again).toBe(created)
    expect(store.list()).toHaveLength(1)
  })

  it('find matches only the exact triple', () => {
    const store = new AnchorStore(new FakeStorage())
    store.ensure(record())
    expect(store.find('s1', 'm1', 'deepseek harness')).toBeDefined()
    expect(store.find('s1', 'm1', 'harness')).toBeUndefined()
    expect(store.find('s1', 'm2', 'deepseek harness')).toBeUndefined()
    expect(store.find('s2', 'm1', 'deepseek harness')).toBeUndefined()
  })

  it('supports message-less (selection-path) anchors keyed by session + text', () => {
    const store = new AnchorStore(new FakeStorage())
    const created = store.ensure(record({ messageId: undefined }))
    expect(created.messageId).toBeUndefined()
    // Idempotent under the same (session, no-message, text) key.
    expect(store.ensure(record({ messageId: undefined }))).toBe(created)
    // Distinct from a message-attributed anchor on the same text.
    store.ensure(record())
    expect(store.list()).toHaveLength(2)
    expect(store.find('s1', undefined, 'deepseek harness')).toBe(created)
    // Persists without the messageId field.
    const storage = new FakeStorage()
    const first = new AnchorStore(storage)
    first.ensure(record({ messageId: undefined }))
    const second = new AnchorStore(storage)
    expect(second.list()).toHaveLength(1)
    expect(second.list()[0]!.messageId).toBeUndefined()
  })

  it('lists by session and finds by sub-session id', () => {
    const store = new AnchorStore(new FakeStorage())
    store.ensure(record())
    store.ensure(record({ sessionId: 's2', text: 'other', subSessionId: 'sub-2' }))
    expect(store.list('s1')).toHaveLength(1)
    expect(store.list('s2')).toHaveLength(1)
    expect(store.list('s3')).toHaveLength(0)
    expect(store.findSub('sub-2')).toMatchObject({ sessionId: 's2' })
  })

  it('notifies subscribers on creation only and supports unsubscribe', () => {
    const store = new AnchorStore(new FakeStorage())
    const listener = vi.fn()
    const off = store.subscribe(listener)
    store.ensure(record())
    store.ensure(record()) // idempotent — no notify
    expect(listener).toHaveBeenCalledTimes(1)
    off()
    store.ensure(record({ text: 'another span', subSessionId: 'sub-3' }))
    expect(listener).toHaveBeenCalledTimes(1)
  })
})
