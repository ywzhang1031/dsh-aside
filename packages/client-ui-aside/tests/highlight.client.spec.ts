// @vitest-environment jsdom
/**
 * Highlight layer tests: range point containment, and the aside highlighter's
 * add/remove/clear lifecycle (jsdom lacks Custom Highlight, so the paint path
 * degrades to Range tracking without throwing).
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { AsideHighlighter, rangeContainsPoint } from '../src/client/highlight.ts'

afterEach(() => {
  document.body.innerHTML = ''
})

function textNodeWith(text: string): { row: HTMLDivElement; text: Text } {
  const row = document.createElement('div')
  row.dataset.chatAnchorKey = 'assistant-step-1'
  const node = document.createTextNode(text)
  row.appendChild(node)
  document.body.appendChild(row)
  return { row, text: node }
}

describe('rangeContainsPoint', () => {
  it('reports membership of a point inside a range', () => {
    const { text } = textNodeWith('deepseek harness')
    const range = document.createRange()
    range.setStart(text, 0)
    range.setEnd(text, 8)
    expect(rangeContainsPoint(range, text, 3)).toBe(true)
    expect(rangeContainsPoint(range, text, 9)).toBe(false)
  })
})

describe('AsideHighlighter', () => {
  it('adds, lists, removes, and clears ranges', () => {
    const highlighter = new AsideHighlighter(document)
    const { row, text } = textNodeWith('deepseek harness mounts plugins')
    const range = document.createRange()
    range.setStart(text, 4)
    range.setEnd(text, 20)
    highlighter.add('sub-1', range)
    expect(highlighter.painted.has('sub-1')).toBe(true)
    expect(highlighter.painted.has(row as unknown as string)).toBe(false)
    highlighter.remove('sub-1')
    expect(highlighter.painted.has('sub-1')).toBe(false)
    highlighter.add('sub-1', range)
    highlighter.add('sub-2', range)
    highlighter.clear()
    expect(highlighter.painted.size).toBe(0)
  })

  it('focuses the exact stored range instead of the whole turn', () => {
    const highlighter = new AsideHighlighter(document)
    const { row, text } = textNodeWith('prefix exact selection suffix')
    const scrollIntoView = vi.fn()
    row.scrollIntoView = scrollIntoView
    const range = document.createRange()
    range.setStart(text, 7)
    range.setEnd(text, 22)
    highlighter.add('sub-1', range)

    expect(highlighter.focus('sub-1')).toBe(true)
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    expect(highlighter.focus('missing')).toBe(false)
  })

  it('rejects a range whose rendered message was replaced', () => {
    const highlighter = new AsideHighlighter(document)
    const { row, text } = textNodeWith('replace me')
    const range = document.createRange()
    range.selectNodeContents(text)
    highlighter.add('sub-1', range)
    row.remove()

    expect(highlighter.focus('sub-1')).toBe(false)
    expect(highlighter.painted.has('sub-1')).toBe(false)
  })
})
