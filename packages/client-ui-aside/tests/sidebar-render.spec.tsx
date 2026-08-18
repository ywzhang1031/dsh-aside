// @vitest-environment jsdom
/**
 * Sidebar component render test: the three sections mount with their empty
 * states and the aside section tracks the current session's anchors.
 */

import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { AnchorStore } from '../src/client/anchors.ts'
import { AsideSidebar } from '../src/client/AsideSidebar.tsx'
import { en } from '../src/client/locales.ts'

describe('AsideSidebar', () => {
  it('renders the three sections with empty states', () => {
    const anchors = new AnchorStore(undefined)
    const api = {
      sessions: { history: vi.fn(() => Promise.resolve({ result: { ok: true, value: { events: [] } } })) },
    } as never
    const t = (key: keyof typeof en) => en[key]
    const view = render(
      <AsideSidebar
        anchors={anchors}
        sessions={{ subscribe: () => () => {}, getCurrent: () => 'session-1' }}
        api={api}
        onOpenAside={() => {}}
        t={t}
      />,
    )
    expect(view.getByText('Aside chats')).toBeDefined()
    expect(view.getByText('Artifacts')).toBeDefined()
    expect(view.getByText('Sources')).toBeDefined()
    expect(view.getByText('Asides appear here after you ask about selected text.')).toBeDefined()
  })

  it('lists the current session\'s anchors and opens one on click', () => {
    const anchors = new AnchorStore(undefined)
    anchors.ensure({ sessionId: 'session-1', messageId: 'm1', text: 'deepseek harness', subSessionId: 'sub-1' })
    anchors.ensure({ sessionId: 'session-2', messageId: 'm2', text: 'other session span', subSessionId: 'sub-2' })
    const opened: string[] = []
    const api = {
      sessions: { history: vi.fn(() => Promise.resolve({ result: { ok: true, value: { events: [] } } })) },
    } as never
    const t = (key: keyof typeof en) => en[key]
    const view = render(
      <AsideSidebar
        anchors={anchors}
        sessions={{ subscribe: () => () => {}, getCurrent: () => 'session-1' }}
        api={api}
        onOpenAside={(anchor) => { opened.push(anchor.subSessionId) }}
        t={t}
      />,
    )
    expect(view.getByText('deepseek harness')).toBeDefined()
    expect(view.queryByText('other session span')).toBeNull()
    view.getByText('deepseek harness').click()
    expect(opened).toEqual(['sub-1'])
  })
})
