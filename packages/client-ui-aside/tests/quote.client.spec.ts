// @vitest-environment jsdom
/**
 * Quote selector tests: whitespace normalization, quote building from a
 * selection (across inline nodes), and Range restoration with occurrence and
 * prefix/suffix disambiguation.
 */

import { afterEach, describe, expect, it } from 'vitest'
import type { AsideAnchor } from '@ywzhang1031/dsh-aside-host/types'
import { buildQuote, normalizeText, restoreRange, restoreInConversation } from '../src/client/quote.ts'

const docs: Document[] = []

afterEach(() => {
  for (const doc of docs.splice(0)) {
    doc.body.innerHTML = ''
  }
})

function rowWith(html: string): { doc: Document; row: HTMLDivElement } {
  const doc = document
  docs.push(doc)
  doc.body.innerHTML = ''
  const row = doc.createElement('div')
  row.dataset.chatAnchorKey = 'assistant-step-1'
  row.innerHTML = html
  doc.body.appendChild(row)
  return { doc, row }
}

function selectText(node: Text, start: number, end: number): Range {
  const range = document.createRange()
  range.setStart(node, start)
  range.setEnd(node, end)
  return range
}

describe('normalizeText', () => {
  it('collapses whitespace runs and trims', () => {
    expect(normalizeText('  a\n\tb   c ')).toBe('a b c')
  })
})

describe('buildQuote', () => {
  it('builds prefix/suffix/occurrence/startOffset for a single-node selection', () => {
    const { row } = rowWith('')
    const text = document.createTextNode('The deepseek harness mounts plugins.')
    row.appendChild(text)
    const range = selectText(text, 4, 20)
    const quote = buildQuote(row, range)
    expect(quote).toMatchObject({ exact: 'deepseek harness', prefix: 'The ', suffix: ' mounts plugins.', occurrence: 1, startOffset: 4 })
  })

  it('records occurrence > 1 for repeated text', () => {
    const { row } = rowWith('')
    const text = document.createTextNode('x y x y')
    row.appendChild(text)
    const range = selectText(text, 4, 5) // second "y"
    const quote = buildQuote(row, range)
    expect(quote!.occurrence).toBe(2)
  })

  it('builds a quote across Markdown inline text nodes', () => {
    const { row } = rowWith('<strong>deepseek</strong> harness <em>mounts</em>')
    const strongText = row.querySelector('strong')!.firstChild as Text
    const range = document.createRange()
    range.setStart(strongText, 0)
    range.setEnd(row.lastChild!.firstChild!, 'mounts'.length) // through "mounts"
    const quote = buildQuote(row, range)
    expect(quote!.exact).toBe('deepseek harness mounts')
  })

  it('returns null for an empty selection', () => {
    const { row } = rowWith('')
    const text = document.createTextNode('abc')
    row.appendChild(text)
    expect(buildQuote(row, selectText(text, 1, 1))).toBeNull()
  })
})

describe('restoreRange', () => {
  const anchor = (exact: string, occurrence: number | null = 1): AsideAnchor => ({
    messageId: 'm1', exact, prefix: '', suffix: '', occurrence, startOffset: null,
  })

  it('restores a range and disambiguates repeated text by occurrence', () => {
    const { row } = rowWith('')
    row.appendChild(document.createTextNode('x y x y'))
    const range = restoreRange(row, anchor('y', 2))
    expect(range).not.toBeNull()
    expect(range!.toString()).toBe('y')
    expect(range!.startOffset).toBe(6)
  })

  it('falls back to normalized whitespace matching', () => {
    const { row } = rowWith('')
    row.appendChild(document.createTextNode('The   deepseek\nharness mounts'))
    const range = restoreRange(row, anchor('deepseek harness'))
    expect(range).not.toBeNull()
    expect(range!.toString()).toBe('deepseek\nharness')
  })

  it('maps the normalized end boundary across a longer raw whitespace run', () => {
    const { row } = rowWith('')
    row.appendChild(document.createTextNode('deepseek   harness'))
    const range = restoreRange(row, anchor('deepseek harness'))
    expect(range).not.toBeNull()
    expect(range!.toString()).toBe('deepseek   harness')
  })

  it('returns null when the exact text is absent', () => {
    const { row } = rowWith('')
    row.appendChild(document.createTextNode('nothing here'))
    expect(restoreRange(row, anchor('deepseek'))).toBeNull()
  })

  it('restores within the message row that contains the text', () => {
    const { doc, row } = rowWith('')
    row.appendChild(document.createTextNode('the deepseek harness here'))
    const range = restoreInConversation(doc.body, anchor('deepseek harness'))
    expect(range).not.toBeNull()
    expect(range!.toString()).toBe('deepseek harness')
  })
})
