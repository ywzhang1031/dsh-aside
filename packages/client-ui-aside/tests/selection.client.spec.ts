// @vitest-environment jsdom
/**
 * Selection resolution and watcher tests: attribution through the runtime's
 * current session (stock renderers publish no message DOM identity), bounds,
 * and the floating button lifecycle. jsdom document with hand-built DOM
 * stands in for the React tree.
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { resolveSelection, SelectionWatcher } from '../src/client/selection.ts'

const docs: Document[] = []

afterEach(() => {
  for (const doc of docs.splice(0)) {
    doc.body.innerHTML = ''
    doc.head.innerHTML = ''
  }
})

function surface(): { doc: Document; message: HTMLParagraphElement } {
  const doc = document
  docs.push(doc)
  doc.body.innerHTML = ''
  const message = doc.createElement('p')
  message.textContent = 'The deepseek harness mounts plugins.'
  doc.body.appendChild(message)
  return { doc, message }
}

function select(doc: Document, node: Node, start: number, end: number): void {
  const range = doc.createRange()
  range.setStart(node, start)
  range.setEnd(node, end)
  const selection = doc.getSelection()!
  selection.removeAllRanges()
  selection.addRange(range)
  doc.dispatchEvent(new Event('selectionchange'))
}

describe('resolveSelection', () => {
  it('resolves a selection to the current session with no message identity', () => {
    const { doc, message } = surface()
    select(doc, message.firstChild!, 4, 20)
    const resolved = resolveSelection(doc, 'session-1')
    expect(resolved).toMatchObject({
      sessionId: 'session-1',
      messageId: null,
      text: 'deepseek harness',
    })
  })

  it('rejects when no session is current', () => {
    const { doc, message } = surface()
    select(doc, message.firstChild!, 4, 20)
    expect(resolveSelection(doc, null)).toBeUndefined()
    expect(resolveSelection(doc, '')).toBeUndefined()
  })

  it('rejects empty, collapsed, and oversized selections', () => {
    const { doc, message } = surface()
    expect(resolveSelection(doc, 'session-1')).toBeUndefined()
    select(doc, message.firstChild!, 4, 4)
    expect(resolveSelection(doc, 'session-1')).toBeUndefined()
    const huge = doc.createTextNode('x'.repeat(900))
    message.textContent = ''
    message.appendChild(huge)
    select(doc, huge, 0, 900)
    expect(resolveSelection(doc, 'session-1')).toBeUndefined()
  })
})

describe('SelectionWatcher', () => {
  it('shows the floating button for a valid selection and hands the context over on click', () => {
    const { doc, message } = surface()
    const onAsk = vi.fn()
    const watcher = new SelectionWatcher(doc, onAsk, '问', () => 'session-1')
    const stop = watcher.start()
    select(doc, message.firstChild!, 4, 20)
    const button = doc.querySelector<HTMLButtonElement>('.aside-ask-button')
    expect(button).not.toBeNull()
    expect(button!.style.display).toBe('block')
    button!.click()
    expect(onAsk).toHaveBeenCalledTimes(1)
    expect(onAsk.mock.calls[0]![0]).toMatchObject({
      sessionId: 'session-1',
      messageId: null,
      text: 'deepseek harness',
    })
    // The button removed itself on activation.
    expect(doc.querySelector('.aside-ask-button')).toBeNull()
    stop()
  })

  it('stays hidden when the runtime reports no current session', () => {
    const { doc, message } = surface()
    const watcher = new SelectionWatcher(doc, () => {}, '问', () => null)
    const stop = watcher.start()
    select(doc, message.firstChild!, 4, 20)
    expect(doc.querySelector('.aside-ask-button')).toBeNull()
    stop()
  })

  it('hides the button when the selection collapses', () => {
    const { doc, message } = surface()
    const watcher = new SelectionWatcher(doc, () => {}, '问', () => 'session-1')
    const stop = watcher.start()
    select(doc, message.firstChild!, 4, 20)
    expect(doc.querySelector('.aside-ask-button')).not.toBeNull()
    const selection = doc.getSelection()!
    selection.removeAllRanges()
    doc.dispatchEvent(new Event('selectionchange'))
    expect(doc.querySelector('.aside-ask-button')).toBeNull()
    stop()
  })

  it('flashes an error label and repaints the normal label later', () => {
    vi.useFakeTimers()
    try {
      const { doc, message } = surface()
      const watcher = new SelectionWatcher(doc, () => {}, '问', () => 'session-1')
      const stop = watcher.start()
      select(doc, message.firstChild!, 4, 20)
      const button = doc.querySelector<HTMLButtonElement>('.aside-ask-button')!
      watcher.flashError('创建失败')
      expect(button.textContent).toContain('创建失败')
      vi.advanceTimersByTime(3000)
      expect(doc.querySelector('.aside-ask-button')).toBeNull()
      stop()
    } finally {
      vi.useRealTimers()
    }
  })

  it('setBusy disables the visible button', () => {
    const { doc, message } = surface()
    const watcher = new SelectionWatcher(doc, () => {}, '问', () => 'session-1')
    const stop = watcher.start()
    select(doc, message.firstChild!, 4, 20)
    const button = doc.querySelector<HTMLButtonElement>('.aside-ask-button')!
    watcher.setBusy(true)
    expect(button.disabled).toBe(true)
    watcher.setBusy(false)
    expect(button.disabled).toBe(false)
    stop()
  })
})
