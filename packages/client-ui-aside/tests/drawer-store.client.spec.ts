/**
 * Drawer store and projection tests: the draft → aside state machine (nothing
 * durable until the first send), the version counter for mid-flight switches,
 * and the raw-event → display-row projection (which strips the durable anchor
 * marker written by the Host).
 */

import { describe, expect, it, vi } from 'vitest'
import type { AsideAnchor } from '@ywzhang1031/dsh-aside-host/types'
import { anchorMessage } from '@ywzhang1031/dsh-aside-host/types'
import { DrawerStore } from '../src/client/drawer-store.ts'
import { projectHistory } from '../src/client/AsideDrawer.tsx'

const ANCHOR: AsideAnchor = { messageId: 'm1', exact: 'deepseek harness', prefix: 'The ', suffix: '.', occurrence: 1, startOffset: 4 }
const RECORD = { schemaVersion: 1 as const, parentSessionId: 's1', subSessionId: 'sub-1', anchor: ANCHOR, createdAt: 1, updatedAt: 2 }

describe('DrawerStore', () => {
  it('opens a draft carrying the full anchor and closes it leaving nothing', () => {
    const store = new DrawerStore()
    const listener = vi.fn()
    store.subscribe(listener)
    store.openDraft({ parentSessionId: 's1', anchor: ANCHOR })
    expect(store.get()).toMatchObject({
      subSessionId: null,
      parentSessionId: 's1',
      anchor: ANCHOR,
      draft: true,
      error: null,
    })
    expect(listener).toHaveBeenCalledTimes(1)
    store.close()
    expect(store.get()).toMatchObject({ subSessionId: null, draft: false, anchor: null })
  })

  it('attaches the created aside only from the draft state and records a full record', () => {
    const store = new DrawerStore()
    store.attach(RECORD, store.getVersion()) // no draft — ignored
    expect(store.get().subSessionId).toBeNull()
    store.openDraft({ parentSessionId: 's1', anchor: ANCHOR })
    const version = store.getVersion()
    expect(store.attach(RECORD, version)).toBe(true)
    expect(store.get()).toMatchObject({ subSessionId: 'sub-1', draft: false })
    expect(store.get().record).toEqual(RECORD)
  })

  it('rejects stale or mismatched first-send records', () => {
    const store = new DrawerStore()
    store.openDraft({ parentSessionId: 's1', anchor: ANCHOR })
    const version = store.getVersion()
    store.close()
    store.openDraft({ parentSessionId: 's1', anchor: { ...ANCHOR, occurrence: 2 } })

    expect(store.attach(RECORD, version)).toBe(false)
    expect(store.attach(RECORD, store.getVersion())).toBe(false)
    expect(store.get()).toMatchObject({ subSessionId: null, draft: true, anchor: { occurrence: 2 } })
  })

  it('reopens an existing aside from its record', () => {
    const store = new DrawerStore()
    store.openSub({ schemaVersion: 1, parentSessionId: 's1', subSessionId: 'sub-1', anchor: ANCHOR, createdAt: 1, updatedAt: 1 })
    expect(store.get()).toMatchObject({ subSessionId: 'sub-1', draft: false, anchor: ANCHOR })
  })

  it('sets and clears errors on any state', () => {
    const store = new DrawerStore()
    store.openSub({ schemaVersion: 1, parentSessionId: 's1', subSessionId: 'sub-1', anchor: ANCHOR, createdAt: 1, updatedAt: 1 })
    store.setError('boom')
    expect(store.get().error).toBe('boom')
    store.clearError()
    expect(store.get().error).toBeNull()
  })

  it('bumps its version on every transition (for mid-flight switch detection)', () => {
    const store = new DrawerStore()
    const before = store.getVersion()
    store.openDraft({ parentSessionId: 's1', anchor: ANCHOR })
    expect(store.getVersion()).toBe(before + 1)
    store.attach(RECORD, store.getVersion())
    expect(store.getVersion()).toBe(before + 2)
    store.close()
    expect(store.getVersion()).toBe(before + 3)
  })
})

describe('projectHistory', () => {
  it('strips the durable anchor marker (pure anchor message becomes invisible)', () => {
    const rows = projectHistory([
      { event: { type: 'user/message', data: { content: [{ type: 'text', text: anchorMessage(ANCHOR) }] } } },
      { event: { type: 'user/message', data: { content: [{ type: 'text', text: '这段话是什么意思？' }] } } },
      { event: { type: 'assistant/message', data: { message: { content: [{ type: 'text', text: '你好，有什么可以帮你？' }] } } } },
      { event: { type: 'tool/call', data: { name: 'web_search' } } },
      { event: { type: 'turn/start', data: {} } },
    ])
    expect(rows).toEqual([
      { kind: 'user', text: '这段话是什么意思？' },
      { kind: 'assistant', text: '你好，有什么可以帮你？' },
      { kind: 'tool', name: 'web_search' },
    ])
  })

  it('shows only this aside history after the last anchor marker', () => {
    const nestedAnchor: AsideAnchor = {
      messageId: 'm2',
      exact: 'nested selection',
      prefix: '',
      suffix: '',
      occurrence: 1,
      startOffset: 0,
    }
    const rows = projectHistory([
      { event: { type: 'user/message', data: { content: [{ type: 'text', text: anchorMessage(ANCHOR) }] } } },
      { event: { type: 'user/message', data: { content: [{ type: 'text', text: '祖先旁注问题' }] } } },
      { event: { type: 'assistant/message', data: { message: { content: [{ type: 'text', text: '祖先旁注回答' }] } } } },
      { event: { type: 'user/message', data: { content: [{ type: 'text', text: anchorMessage(nestedAnchor) }] } } },
      { event: { type: 'user/message', data: { content: [{ type: 'text', text: '当前旁注问题' }] } } },
      { event: { type: 'assistant/message', data: { message: { content: [{ type: 'text', text: '当前旁注回答' }] } } } },
    ])
    expect(rows).toEqual([
      { kind: 'user', text: '当前旁注问题' },
      { kind: 'assistant', text: '当前旁注回答' },
    ])
  })

  it('skips blank text messages and unknown tool names', () => {
    const rows = projectHistory([
      { event: { type: 'user/message', data: { content: [{ type: 'text', text: '   ' }] } } },
      { event: { type: 'assistant/message', data: { message: { content: [{ type: 'image' }] } } } },
      { event: { type: 'tool/call', data: {} } },
    ])
    expect(rows).toEqual([])
  })
})
