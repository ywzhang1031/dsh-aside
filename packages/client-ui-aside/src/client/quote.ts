/**
 * Quote selector: build and restore the precise character span an aside is
 * anchored to, across Markdown's inline element boundaries. The anchor keeps
 * `exact` (the selected prose), `prefix`/`suffix` (surrounding text for
 * disambiguation), `occurrence` (1-based index among identical matches) and
 * `startOffset` (character offset inside the message's plain text). None of
 * these is a sole source of truth — restore tries raw then whitespace-
 * normalized matching and degrades gracefully.
 * @module @ywzhang1031/dsh-client-ui-aside/quote
 */

import type { AsideAnchor } from '@ywzhang1031/dsh-aside-host/types'

/** A text node plus its character offsets inside a message's concatenated text. */
export interface TextSpan {
  node: Text
  start: number
  end: number
}

/** Collapse every whitespace run to one space and trim (matching normalizer). */
export function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/** Walk a message subtree and return its text nodes plus the concatenated text. */
export function collectTextSpans(root: Node): { text: string; spans: TextSpan[] } {
  const doc = root.ownerDocument ?? (typeof document !== 'undefined' ? document : undefined)
  if (doc === undefined) return { text: '', spans: [] }
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const spans: TextSpan[] = []
  let text = ''
  let current: Node | null
  while ((current = walker.nextNode()) !== null) {
    const node = current as Text
    const start = text.length
    text += node.data
    spans.push({ node, start, end: text.length })
  }
  return { text, spans }
}

/** Resolve a (container, offset) to an absolute character offset, or null. */
function absoluteOffset(spans: TextSpan[], container: Node, offset: number): number | null {
  if (container.nodeType === Node.TEXT_NODE) {
    const span = spans.find(item => item.node === container)
    if (span === undefined) return null
    return span.start + offset
  }
  // Element container: locate the first text node after the given child index.
  if (container.nodeType === Node.ELEMENT_NODE) {
    const child = (container as Element).childNodes[offset]
    if (child === undefined) return null
    const first = firstTextOffset(spans, child)
    if (first !== null) return first
    // Fall back to the next text node at or after this point.
    for (const span of spans) {
      if (container.compareDocumentPosition(span.node) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
        if ((child.compareDocumentPosition(span.node) & (Node.DOCUMENT_POSITION_FOLLOWING | Node.DOCUMENT_POSITION_CONTAINED_BY)) !== 0) return span.start
      }
    }
  }
  return null
}

function firstTextOffset(spans: TextSpan[], root: Node): number | null {
  for (const span of spans) {
    if (root === span.node || root.contains(span.node)) return span.start
  }
  return null
}

/** Count occurrences of `needle` in `haystack` strictly before `before`. */
function priorOccurrences(haystack: string, needle: string, before: number): number {
  let count = 0
  let index = haystack.indexOf(needle)
  while (index !== -1 && index < before) {
    count += 1
    index = haystack.indexOf(needle, index + needle.length)
  }
  return count
}

/**
 * Build the disambiguation fields for a selection range inside one message.
 * Returns null when the range carries no usable text.
 */
export function buildQuote(
  messageEl: Element,
  range: Range,
): Omit<AsideAnchor, 'messageId'> | null {
  const exact = range.toString()
  if (exact.trim() === '') return null
  const { text, spans } = collectTextSpans(messageEl)
  const start = absoluteOffset(spans, range.startContainer, range.startOffset)
  const end = absoluteOffset(spans, range.endContainer, range.endOffset)
  const startOffset = start ?? 0
  const occurrence = start === null ? null : priorOccurrences(text, exact, start) + 1
  const prefix = start === null ? '' : text.slice(Math.max(0, start - 60), start)
  const suffix = end === null ? '' : text.slice(end, end + 60)
  return { exact, prefix, suffix, occurrence, startOffset }
}

/** Map an absolute character offset to a (text node, node-local offset). */
function spanAt(spans: TextSpan[], offset: number): { node: Text; offset: number } | null {
  for (const span of spans) {
    if (offset >= span.start && offset <= span.end) {
      return { node: span.node, offset: Math.min(offset - span.start, span.node.data.length) }
    }
  }
  // Offset past the last node: clamp to the final text node's end.
  const last = spans[spans.length - 1]
  if (last !== undefined && offset >= last.end) return { node: last.node, offset: last.node.data.length }
  return null
}

interface TextMatch { start: number; end: number }

/** All raw ranges of `needle` in `haystack` (exact, then normalized). */
function matchRanges(haystack: string, needle: string): TextMatch[] {
  const raw = indexAll(haystack, needle)
  if (raw.length > 0) return raw.map(start => ({ start, end: start + needle.length }))
  const normalizedHaystack = normalizeText(haystack)
  const normalizedNeedle = normalizeText(needle)
  if (normalizedNeedle === '') return []
  // Map both normalized boundaries back to raw offsets. Mapping only the start
  // truncates a restored Range whenever one normalized space represents a
  // longer raw whitespace run.
  return indexAll(normalizedHaystack, normalizedNeedle)
    .map((offset): TextMatch | null => {
      const start = denormalizeOffset(haystack, offset)
      const end = denormalizeOffset(haystack, offset + normalizedNeedle.length)
      return start === null || end === null ? null : { start, end }
    })
    .filter((match): match is TextMatch => match !== null)
}

function indexAll(haystack: string, needle: string): number[] {
  const out: number[] = []
  if (needle === '') return out
  let index = haystack.indexOf(needle)
  while (index !== -1) {
    out.push(index)
    index = haystack.indexOf(needle, index + needle.length)
  }
  return out
}

/** Convert a normalized-string offset back to a raw-string offset. */
function denormalizeOffset(raw: string, normalizedOffset: number): number | null {
  let rawIndex = 0
  let normIndex = 0
  while (rawIndex < raw.length && normIndex < normalizedOffset) {
    const rawChar = raw[rawIndex]!
    if (/\s/.test(rawChar)) {
      // Skip the whole raw whitespace run for one normalized space.
      while (rawIndex < raw.length && /\s/.test(raw[rawIndex]!)) rawIndex += 1
      normIndex += 1
    } else {
      rawIndex += 1
      normIndex += 1
    }
  }
  return normIndex === normalizedOffset ? rawIndex : null
}

/**
 * Restore the Range an anchor describes inside one message element. Tries the
 * recorded occurrence, then prefix/suffix disambiguation, then normalized
 * matching. Returns null when no reliable span can be found.
 */
export function restoreRange(messageEl: Element, anchor: AsideAnchor): Range | null {
  const doc = messageEl.ownerDocument ?? (typeof document !== 'undefined' ? document : undefined)
  if (doc === undefined) return null
  const { text, spans } = collectTextSpans(messageEl)
  if (text === '' || anchor.exact === '') return null

  const matches = matchRanges(text, anchor.exact)
  if (matches.length === 0) return null
  const starts = matches.map(match => match.start)

  let match: TextMatch
  if (anchor.occurrence !== null && anchor.occurrence >= 1 && anchor.occurrence <= starts.length) {
    match = matches[anchor.occurrence - 1]!
  } else {
    const start = disambiguate(text, starts, anchor)
    match = matches.find(candidate => candidate.start === start)!
  }

  const startPoint = spanAt(spans, match.start)
  const endPoint = spanAt(spans, match.end)
  if (startPoint === null || endPoint === null) return null

  const range = doc.createRange()
  range.setStart(startPoint.node, startPoint.offset)
  range.setEnd(endPoint.node, endPoint.offset)
  return range
}

/** Pick a match by prefix/suffix proximity when occurrence is unavailable. */
function disambiguate(text: string, starts: number[], anchor: AsideAnchor): number {
  let best = starts[0]!
  let bestScore = -1
  for (const start of starts) {
    const before = text.slice(Math.max(0, start - anchor.prefix.length), start)
    const after = text.slice(start + anchor.exact.length, start + anchor.exact.length + anchor.suffix.length)
    const score = similarity(before, anchor.prefix) + similarity(after, anchor.suffix)
    if (score > bestScore) {
      bestScore = score
      best = start
    }
  }
  return best
}

function similarity(left: string, right: string): number {
  const a = normalizeText(left)
  const b = normalizeText(right)
  if (a === '' || b === '') return 0
  if (a === b) return 2
  return a.endsWith(b) || b.endsWith(a) ? 1 : 0
}

/**
 * Find the chat-anchor row (one rendered message node) whose text contains
 * the anchor's exact prose. Used to scope exact-text restoration to a single
 * message. Falls back to null when no row contains it (the caller then
 * degrades to message-level positioning).
 */
export function findRowContaining(root: ParentNode, exact: string): HTMLElement | null {
  const needle = normalizeText(exact)
  if (needle === '') return null
  for (const row of root.querySelectorAll('[data-chat-anchor-key]')) {
    if (!(row instanceof HTMLElement)) continue
    if (normalizeText(row.textContent ?? '').includes(needle)) return row
  }
  return null
}

/**
 * Restore the Range for an anchor by first locating the message row that
 * contains its exact text, then narrowing within that row. Returns null when
 * either the row or the precise span cannot be recovered.
 */
export function restoreInConversation(root: ParentNode, anchor: AsideAnchor): Range | null {
  const row = findRowContaining(root, anchor.exact)
  if (row === null) return null
  return restoreRange(row, anchor)
}
