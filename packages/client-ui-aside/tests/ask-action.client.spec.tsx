// @vitest-environment jsdom
/**
 * AsideAskAction tests: the per-message strip entry resolves the current
 * session, reads the message text from history, opens a draft (or reopens
 * the existing aside), and registers/unregisters its DOM with the registry.
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import type { IApiClient } from '@deepseek-ai/dsh-client-connection/client'
import { AsideRepository } from '../src/client/repository.ts'
import { DrawerStore } from '../src/client/drawer-store.ts'
import { MessageDomRegistry } from '../src/client/message-dom-registry.ts'
import { AsideAskAction, messageAnchor, type AsideAskSessions } from '../src/client/AsideAskAction.tsx'
import { zh } from '../src/client/locales.ts'

afterEach(() => {
  cleanup()
})

const t = (key: keyof typeof zh): string => zh[key]

function historyWithMessage(text: string) {
  return vi.fn(() => Promise.resolve({
    result: {
      ok: true,
      value: {
        events: [
          { event: { type: 'turn/start', data: { turn: 1 } } },
          { event: { type: 'assistant/message', data: { message: { id: 'm-1', role: 'assistant', content: [{ type: 'text', text }] } } } },
        ],
      },
    },
  }))
}

function harness(overrides: { text?: string; current?: string | null } = {}) {
  const { text = 'The deepseek harness mounts plugins.' } = overrides
  const current = 'current' in overrides ? overrides.current : 'session-1'
  const history = historyWithMessage(text)
  const api = { sessions: { history } } as unknown as IApiClient
  const sessions: AsideAskSessions = {
    list: {
      subscribe: () => () => {},
      getSnapshot: () => ({ current }),
    },
  }
  const repository = new AsideRepository({ list: vi.fn(() => Promise.resolve({ ok: true, value: { records: [] } })) })
  const drawer = new DrawerStore()
  const registry = new MessageDomRegistry()
  return { api, sessions, repository, drawer, registry, history }
}

describe('AsideAskAction', () => {
  it('anchors a whole-message action to the final rendered occurrence', () => {
    expect(messageAnchor('m-1', 'final answer', 'Think quotes final answer. final answer')).toMatchObject({
      messageId: 'm-1',
      exact: 'final answer',
      occurrence: 2,
      startOffset: 27,
    })
  })

  it('opens a draft anchored to the message text on first ask', async () => {
    const { api, sessions, repository, drawer, registry } = harness()
    render(<AsideAskAction messageId={'m-1' as never} api={api} sessions={sessions} repository={repository} drawer={drawer} registry={registry} t={t} />)
    fireEvent.click(document.querySelector('button')!)
    await vi.waitFor(() => {
      const state = drawer.get()
      expect(state.draft).toBe(true)
      expect(state.parentSessionId).toBe('session-1')
      expect(state.anchor).toMatchObject({ messageId: 'm-1', exact: 'The deepseek harness mounts plugins.' })
    })
  })

  it('reopens the existing aside when the span was already asked', async () => {
    const { api, sessions, repository, drawer, registry } = harness()
    await repository.refresh('session-1')
    repository.add({ schemaVersion: 1, parentSessionId: 'session-1', subSessionId: 'sub-1', anchor: { messageId: 'm-1', exact: 'The deepseek harness mounts plugins.', prefix: '', suffix: '', occurrence: null, startOffset: null }, createdAt: 1, updatedAt: 1 })
    render(<AsideAskAction messageId={'m-1' as never} api={api} sessions={sessions} repository={repository} drawer={drawer} registry={registry} t={t} />)
    fireEvent.click(document.querySelector('button')!)
    await vi.waitFor(() => {
      const state = drawer.get()
      expect(state.draft).toBe(false)
      expect(state.subSessionId).toBe('sub-1')
    })
  })

  it('registers its DOM with the registry and unregisters on unmount', () => {
    const { api, sessions, repository, drawer, registry } = harness()
    const view = render(<AsideAskAction messageId={'m-1' as never} api={api} sessions={sessions} repository={repository} drawer={drawer} registry={registry} t={t} />)
    expect(registry.size).toBe(1)
    expect(registry.get('m-1')).toBeDefined()
    view.unmount()
    expect(registry.size).toBe(0)
  })

  it('does nothing without a current session', async () => {
    const { api, sessions, repository, drawer, registry, history } = harness({ current: null })
    render(<AsideAskAction messageId={'m-1' as never} api={api} sessions={sessions} repository={repository} drawer={drawer} registry={registry} t={t} />)
    fireEvent.click(document.querySelector('button')!)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(drawer.get().draft).toBe(false)
    expect(history).not.toHaveBeenCalled()
  })
})
