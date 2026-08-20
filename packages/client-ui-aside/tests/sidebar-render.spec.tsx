// @vitest-environment jsdom
/**
 * Sidebar component render test: the single aside section mounts with its
 * empty state and tracks the current session's Host-backed records.
 */

import { describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import type { AsideRecord } from 'dsh-aside-host/types'
import { AsideRepository } from '../src/client/repository.ts'
import { DrawerStore } from '../src/client/drawer-store.ts'
import { AsideSidebar } from '../src/client/AsideSidebar.tsx'
import { en } from '../src/client/locales.ts'

const t = (key: keyof typeof en, vars?: Record<string, string>) => {
  let value = en[key]
  for (const [name, replacement] of Object.entries(vars ?? {})) value = value.replace(`{{${name}}}`, replacement)
  return value
}

function record(parentSessionId: string, subSessionId: string, exact: string): AsideRecord {
  return { schemaVersion: 1, parentSessionId, subSessionId, anchor: { messageId: null, exact, prefix: '', suffix: '', occurrence: null, startOffset: null }, createdAt: 1, updatedAt: 1 }
}

function repoWith(records: AsideRecord[]) {
  const list = vi.fn((request: { parentSessionId: string }) => Promise.resolve({
    ok: true,
    value: { records: records.filter(item => item.parentSessionId === request.parentSessionId) },
  }))
  return { repo: new AsideRepository({ list }), list }
}

describe('AsideSidebar', () => {
  it('renders the aside section with its empty state and no artifacts/sources', async () => {
    const { repo } = repoWith([])
    const view = render(
      <AsideSidebar
        repository={repo}
        drawer={new DrawerStore()}
        sessions={{ subscribe: () => () => {}, getCurrent: () => 'session-1' }}
        onOpenAside={() => {}}
        t={t}
      />,
    )
    expect(view.getByText('Aside chats')).toBeDefined()
    expect(view.queryByText('Artifacts')).toBeNull()
    expect(view.queryByText('Sources')).toBeNull()
    await waitFor(() => {
      expect(view.getByText('Asides appear here after you ask about selected text.')).toBeDefined()
    })
  })

  it("lists the current session's records and opens one on click", async () => {
    const { repo, list } = repoWith([
      record('session-1', 'sub-1', 'deepseek harness'),
      record('session-2', 'sub-2', 'other session span'),
    ])
    const opened: string[] = []
    const drawer = new DrawerStore()
    const view = render(
      <AsideSidebar
        repository={repo}
        drawer={drawer}
        sessions={{ subscribe: () => () => {}, getCurrent: () => 'session-1' }}
        onOpenAside={(item) => { opened.push(item.subSessionId) }}
        t={t}
      />,
    )
    await waitFor(() => { expect(list).toHaveBeenCalledWith({ parentSessionId: 'session-1' }) })
    await waitFor(() => { expect(view.getByText('deepseek harness')).toBeDefined() })
    expect(view.queryByText('other session span')).toBeNull()
    expect(view.container.querySelector('time')).not.toBeNull()
    view.getByText('deepseek harness').click()
    expect(opened).toEqual(['sub-1'])
  })
})
