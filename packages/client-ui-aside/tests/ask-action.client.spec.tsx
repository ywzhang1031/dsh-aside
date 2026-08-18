// @vitest-environment jsdom
/**
 * AsideAskAction tests: the per-message strip entry resolves the current
 * session, reads the message text from history, and opens a draft (or
 * reopens the existing aside for an already-asked span).
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import type { IApiClient } from '@deepseek-ai/dsh-client-connection/client'
import { AnchorStore } from '../src/client/anchors.ts'
import { DrawerStore } from '../src/client/drawer-store.ts'
import { AsideAskAction, type AsideAskSessions } from '../src/client/AsideAskAction.tsx'
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
          {
            event: {
              type: 'assistant/message',
              data: {
                message: {
                  id: 'm-1',
                  role: 'assistant',
                  content: [{ type: 'text', text }],
                },
              },
            },
          },
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
  const anchors = new AnchorStore(undefined)
  const drawer = new DrawerStore()
  return { api, sessions, anchors, drawer, history }
}

describe('AsideAskAction', () => {
  it('opens a draft anchored to the message text on first ask', async () => {
    const { api, sessions, anchors, drawer } = harness()
    render(<AsideAskAction messageId={'m-1' as never} api={api} sessions={sessions} anchors={anchors} drawer={drawer} t={t} />)
    fireEvent.click(document.querySelector('button')!)
    await vi.waitFor(() => {
      const state = drawer.get()
      expect(state.draft).toBe(true)
      expect(state.parentSessionId).toBe('session-1')
      expect(state.messageId).toBe('m-1')
      expect(state.anchorText).toBe('The deepseek harness mounts plugins.')
    })
  })

  it('reopens the existing aside when the span was already asked', async () => {
    const { api, sessions, anchors, drawer } = harness()
    anchors.ensure({
      sessionId: 'session-1',
      messageId: 'm-1',
      text: 'The deepseek harness mounts plugins.',
      subSessionId: 'sub-1',
    })
    render(<AsideAskAction messageId={'m-1' as never} api={api} sessions={sessions} anchors={anchors} drawer={drawer} t={t} />)
    fireEvent.click(document.querySelector('button')!)
    await vi.waitFor(() => {
      const state = drawer.get()
      expect(state.draft).toBe(false)
      expect(state.subSessionId).toBe('sub-1')
    })
  })

  it('does nothing without a current session', async () => {
    const { api, sessions, anchors, drawer, history } = harness({ current: null })
    render(<AsideAskAction messageId={'m-1' as never} api={api} sessions={sessions} anchors={anchors} drawer={drawer} t={t} />)
    fireEvent.click(document.querySelector('button')!)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(drawer.get().draft).toBe(false)
    expect(history).not.toHaveBeenCalled()
  })
})
