// @vitest-environment jsdom
/** Drawer interaction tests for command discovery and provider-scoped reasoning. */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { DrawerStore } from '../src/client/drawer-store.ts'
import { AsideDrawer } from '../src/client/AsideDrawer.tsx'
import { en } from '../src/client/locales.ts'

afterEach(cleanup)

const RECORD = {
  schemaVersion: 1 as const,
  parentSessionId: 'parent',
  subSessionId: 'aside-1',
  anchor: { messageId: 'm1', exact: 'deepseek harness', prefix: '', suffix: '', occurrence: 1, startOffset: 0 },
  createdAt: 1,
  updatedAt: 1,
}

const t = (key: keyof typeof en, vars?: Record<string, string>) => {
  let value = en[key]
  for (const [name, replacement] of Object.entries(vars ?? {})) value = value.replace(`{{${name}}}`, replacement)
  return value
}

function api() {
  return {
    sessions: {
      history: vi.fn(async () => ({ result: { ok: true, value: { events: [] } } })),
      models: vi.fn(async () => ({
        result: {
          ok: true,
          value: {
            current: { provider: 'provider-b', model: 'shared-model' },
            routable: true,
            groups: [
              { id: 'provider-a', name: 'A', models: [{ id: 'shared-model', name: 'Shared', reasoning: { efforts: [{ id: 'wrong', name: 'Wrong provider' }] } }] },
              { id: 'provider-b', name: 'B', models: [{ id: 'shared-model', name: 'Shared', reasoning: { efforts: [{ id: 'high', name: 'High' }] } }] },
            ],
            failures: [],
          },
        },
      })),
      selectModel: vi.fn(async () => ({ result: { ok: true, value: {} } })),
      prompt: vi.fn(async () => ({ result: { ok: true, value: {} } })),
    },
  }
}

describe('AsideDrawer', () => {
  it('shows a real slash-command menu and provider-scoped reasoning choices', async () => {
    const store = new DrawerStore()
    store.openSub(RECORD)
    const view = render(<AsideDrawer store={store} api={api() as never} onFirstSend={vi.fn()} t={t} />)

    expect(view.queryByText('Open in full')).toBeNull()
    await waitFor(() => { expect(view.getByRole('option', { name: 'High' })).toBeDefined() })
    expect(view.queryByRole('option', { name: 'Wrong provider' })).toBeNull()

    const input = view.getByPlaceholderText('Type a message, or / for commands')
    fireEvent.change(input, { target: { value: '/' } })
    expect(view.getByRole('option', { name: '/model' })).toBeDefined()
    expect(view.getByRole('option', { name: '/compact' })).toBeDefined()
    fireEvent.click(view.getByRole('option', { name: '/model' }))
    expect((input as HTMLTextAreaElement).value).toBe('/model ')
  })

  it('never lets a slash command create a draft aside', async () => {
    const store = new DrawerStore()
    store.openDraft({ parentSessionId: 'parent', anchor: RECORD.anchor })
    const onFirstSend = vi.fn(async () => true)
    const view = render(<AsideDrawer store={store} api={api() as never} onFirstSend={onFirstSend} t={t} />)

    const input = view.getByPlaceholderText('Type a message, or / for commands')
    fireEvent.change(input, { target: { value: '/model' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(await view.findByText('Send a question first to create the aside, then use commands.')).toBeDefined()
    expect(onFirstSend).not.toHaveBeenCalled()
  })

  it('shows the same model controls in a draft and applies its local selection on first send', async () => {
    const store = new DrawerStore()
    store.openDraft({ parentSessionId: 'parent', anchor: RECORD.anchor })
    const client = api()
    const onFirstSend = vi.fn(async () => true)
    const view = render(<AsideDrawer store={store} api={client as never} onFirstSend={onFirstSend} t={t} />)

    await waitFor(() => {
      expect(client.sessions.models).toHaveBeenCalledWith({ sessionId: 'parent' }, expect.any(AbortSignal))
    })
    expect(view.getAllByTitle(en.readonlyHint)).toHaveLength(1)

    fireEvent.change(view.getByRole('combobox', { name: 'Model' }), {
      target: { value: 'provider-a\u0000shared-model' },
    })
    await waitFor(() => {
      expect(view.getByRole('option', { name: 'Wrong provider' })).toBeDefined()
    })
    fireEvent.change(view.getByRole('combobox', { name: 'Reasoning' }), {
      target: { value: 'wrong' },
    })

    const input = view.getByPlaceholderText('Type a message, or / for commands')
    fireEvent.change(input, { target: { value: 'Explain this selection.' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => {
      expect(onFirstSend).toHaveBeenCalledWith('Explain this selection.', {
        provider: 'provider-a',
        model: 'shared-model',
        reasoningEffort: 'wrong',
      })
    })
    expect(client.sessions.selectModel).not.toHaveBeenCalled()
  })

  it('matches the main composer IME, newline, repeat, and Enter submission semantics', () => {
    vi.useFakeTimers()
    try {
      const store = new DrawerStore()
      store.openDraft({ parentSessionId: 'parent', anchor: RECORD.anchor })
      const onFirstSend = vi.fn(async () => true)
      const view = render(<AsideDrawer store={store} api={api() as never} onFirstSend={onFirstSend} t={t} />)
      const input = view.getByPlaceholderText('Type a message, or / for commands')
      fireEvent.change(input, { target: { value: '还在输入' } })

      fireEvent.compositionStart(input)
      expect(fireEvent.keyDown(input, { key: ' ' })).toBe(true)
      expect(fireEvent.keyDown(input, { key: 'Enter' })).toBe(true)
      expect(onFirstSend).not.toHaveBeenCalled()

      fireEvent.compositionEnd(input)
      // Some IMEs close composition with Space, then deliver a closing Enter.
      expect(fireEvent.keyDown(input, { key: 'Enter' })).toBe(true)
      expect(onFirstSend).not.toHaveBeenCalled()
      vi.advanceTimersByTime(20)

      expect(fireEvent.keyDown(input, { key: 'Enter', isComposing: true })).toBe(true)
      expect(fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 })).toBe(true)
      expect(fireEvent.keyDown(input, { key: 'Enter', shiftKey: true })).toBe(true)
      expect(fireEvent.keyDown(input, { key: 'Enter', repeat: true })).toBe(false)
      expect(onFirstSend).not.toHaveBeenCalled()

      expect(fireEvent.keyDown(input, { key: 'Enter' })).toBe(false)
      expect(onFirstSend).toHaveBeenCalledTimes(1)
      expect(onFirstSend.mock.calls[0]?.[0]).toBe('还在输入')
    } finally {
      vi.useRealTimers()
    }
  })

  it('refreshes immediately when a hidden page becomes visible again', async () => {
    const store = new DrawerStore()
    store.openSub(RECORD)
    const client = api()
    const originalHidden = Object.getOwnPropertyDescriptor(document, 'hidden')
    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
    try {
      const view = render(<AsideDrawer store={store} api={client as never} onFirstSend={vi.fn()} t={t} />)
      await view.findByText('No messages yet. Send the first question to start.')
      expect(client.sessions.history).toHaveBeenCalledTimes(1)

      document.dispatchEvent(new Event('visibilitychange'))
      await waitFor(() => { expect(client.sessions.history).toHaveBeenCalledTimes(2) })
    } finally {
      if (originalHidden === undefined) delete (document as unknown as { hidden?: boolean }).hidden
      else Object.defineProperty(document, 'hidden', originalHidden)
    }
  })
})
