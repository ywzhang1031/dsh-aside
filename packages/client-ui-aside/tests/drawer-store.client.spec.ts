/**
 * Drawer store and fold tests: the draft → aside state machine (nothing
 * durable until the first send), opening questions, and the raw-event →
 * display-row / artifact / source folds.
 */

import { describe, expect, it, vi } from 'vitest'
import { DrawerStore, openingQuestion } from '../src/client/drawer-store.ts'
import { projectHistory } from '../src/client/AsideDrawer.tsx'
import { foldArtifacts, foldSources } from '../src/client/fold.ts'

describe('DrawerStore', () => {
  it('opens a draft with an empty composer identity and closes it leaving nothing', () => {
    const store = new DrawerStore()
    const listener = vi.fn()
    store.subscribe(listener)
    store.openDraft({ parentSessionId: 's1', anchorText: '什么是 sandbox', messageId: 'm1' })
    expect(store.get()).toMatchObject({
      subSessionId: null,
      parentSessionId: 's1',
      anchorText: '什么是 sandbox',
      messageId: 'm1',
      draft: true,
      error: null,
    })
    expect(listener).toHaveBeenCalledTimes(1)
    store.close()
    expect(store.get()).toMatchObject({ subSessionId: null, draft: false })
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('attaches the created aside only from the draft state', () => {
    const store = new DrawerStore()
    store.attach('sub-1') // no draft — ignored
    expect(store.get().subSessionId).toBeNull()
    store.openDraft({ parentSessionId: 's1', anchorText: 'x', messageId: 'm1' })
    store.attach('sub-1')
    expect(store.get()).toMatchObject({ subSessionId: 'sub-1', draft: false })
  })

  it('reopens an existing aside and reports errors only while a draft can still retry', () => {
    const store = new DrawerStore()
    store.openSub({ subSessionId: 'sub-1', parentSessionId: 's1', anchorText: 'x' })
    expect(store.get().draft).toBe(false)
    store.setError('ignored') // attached aside: errors surface nowhere
    expect(store.get().error).toBeNull()
    store.close()
    store.openDraft({ parentSessionId: 's1', anchorText: 'x', messageId: 'm1' })
    store.setError('boom')
    expect(store.get().error).toBe('boom')
  })

  it('builds the opening question with the anchored source attached', () => {
    expect(openingQuestion('这段话是什么意思？', 'deepseek harness'))
      .toBe('这段话是什么意思？\n\n---\n引用原文：\ndeepseek harness')
    expect(openingQuestion('   ', 'deepseek harness')).toBe('')
  })
})

describe('projectHistory', () => {
  it('folds user/assistant surface messages and tool heads into display rows', () => {
    const rows = projectHistory([
      { event: { type: 'user/message', data: { content: [{ type: 'text', text: '你好' }] } } },
      { event: { type: 'assistant/message', data: { message: { content: [{ type: 'text', text: '你好，有什么可以帮你？' }] } } } },
      { event: { type: 'tool/call', data: { name: 'web_search' } } },
      { event: { type: 'turn/start', data: {} } },
    ])
    expect(rows).toEqual([
      { kind: 'user', text: '你好' },
      { kind: 'assistant', text: '你好，有什么可以帮你？' },
      { kind: 'tool', name: 'web_search' },
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

describe('foldArtifacts', () => {
  it('collects produced paths from write/edit result metadata, deduplicated', () => {
    const rows = foldArtifacts([
      { event: { type: 'tool/result', data: { meta: { path: '/work/report.md' } } } },
      { event: { type: 'tool/result', data: { meta: { path: '/work/report.md' } } } },
      { event: { type: 'tool/result', data: { meta: { diffs: [{ path: '/work/notes.md' }] } } } },
      { event: { type: 'tool/result', data: { meta: { locations: [{ path: '/work/site/index.html' }] } } } },
      { event: { type: 'tool/result', data: { isError: true, meta: { path: '/work/skipped.md' } } } },
      { event: { type: 'tool/result', data: { meta: { sources: [] } } } },
    ])
    expect(rows.map(row => row.path)).toEqual(['/work/report.md', '/work/notes.md', '/work/site/index.html'])
    expect(rows[0]!.name).toBe('report.md')
  })
})

describe('foldSources', () => {
  it('collects web-search sources with title, url, and meta line', () => {
    const rows = foldSources([
      {
        event: {
          type: 'tool/result',
          data: {
            meta: {
              sources: [
                { title: 'DeepSeek Harness', url: 'https://example.com/harness', snippet: 'The plugin runtime', publishedAt: '2026-08-01' },
                { title: '', url: 'https://example.com/plain' },
                { url: 'https://example.com/dup', title: 'Dup' },
                { url: 'https://example.com/dup', title: 'Dup again' },
              ],
            },
          },
        },
      },
      { event: { type: 'tool/result', data: { meta: { path: '/work/x.md' } } } },
    ])
    expect(rows).toEqual([
      { title: 'DeepSeek Harness', url: 'https://example.com/harness', meta: 'The plugin runtime — (2026-08-01)' },
      { title: 'https://example.com/plain', url: 'https://example.com/plain' },
      { title: 'Dup', url: 'https://example.com/dup' },
    ])
  })
})
