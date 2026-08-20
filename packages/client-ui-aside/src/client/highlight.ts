/**
 * Exact-text highlight over the parent conversation: restore each aside's
 * anchor Range and paint it with the CSS Custom Highlight API (no `<mark>`
 * wrapping of React-managed text). One shared highlight carries every
 * aside's Range; click identification resolves the point with
 * `caretPositionFromPoint`/`caretRangeFromPoint` and tests membership in
 * each aside's restored Range. Browsers without Custom Highlight fall back to
 * message-level styling; the caller owns that CSS class.
 * @module dsh-client-ui-aside/highlight
 */

import type { AsideAnchor } from 'dsh-aside-host/types'
import { restoreRange } from './quote.ts'

/** The single CSS highlight name shared by every aside's exact highlight. */
export const HIGHLIGHT_NAME = 'aside-highlight'
/** Short-lived stronger highlight used when the sidebar locates an anchor. */
export const ACTIVE_HIGHLIGHT_NAME = 'aside-highlight-active'

/** Whether the browser exposes the CSS Custom Highlight API. */
export function supportsCustomHighlight(): boolean {
  return typeof CSS !== 'undefined'
    && 'highlights' in CSS
    && typeof Highlight !== 'undefined'
}

/** Whether a collapsed point (node, offset) lies inside a Range. */
export function rangeContainsPoint(range: Range, node: Node, offset: number): boolean {
  try {
    return range.isPointInRange(node, offset)
  } catch {
    return false
  }
}

/**
 * Owns the live set of exact highlight Ranges for one conversation. Re-adding
 * an aside replaces its previous Range (a DOM re-render recovers the span by
 * calling {@link AsideHighlighter.add} again with a freshly restored Range).
 */
export class AsideHighlighter {
  private readonly ranges = new Map<string, Range>()
  private highlight: Highlight | null = null
  private activeHighlight: Highlight | null = null
  private activeTimer: ReturnType<typeof setTimeout> | undefined
  private activeSubSessionId: string | null = null

  constructor(private readonly doc: Document) {}

  /** The set of sub-session ids currently painted exactly. */
  get painted(): ReadonlySet<string> {
    return new Set(this.ranges.keys())
  }

  /** Add or replace one aside's exact Range. Returns true when supported. */
  add(subSessionId: string, range: Range): boolean {
    this.ranges.set(subSessionId, range)
    this.refresh()
    return supportsCustomHighlight()
  }

  /** Remove one aside's exact Range. */
  remove(subSessionId: string): void {
    if (!this.ranges.delete(subSessionId)) return
    if (this.activeSubSessionId === subSessionId) this.clearFocus()
    this.refresh()
  }

  /** Remove every exact Range. */
  clear(): void {
    this.clearFocus()
    if (this.ranges.size === 0) return
    this.ranges.clear()
    this.refresh()
  }

  /**
   * Scroll the exact stored span into view and briefly strengthen its paint.
   * Returns false when that span is not currently mounted, so callers can
   * fall back to the containing message row.
   */
  focus(subSessionId: string): boolean {
    const range = this.ranges.get(subSessionId)
    if (range === undefined) return false
    if (!range.startContainer.isConnected
      || !range.endContainer.isConnected
      || range.collapsed
      || range.toString().trim() === '') {
      this.ranges.delete(subSessionId)
      this.refresh()
      return false
    }
    const start = range.startContainer.nodeType === Node.ELEMENT_NODE
      ? range.startContainer as Element
      : range.startContainer.parentElement
    if (start instanceof HTMLElement && typeof start.scrollIntoView === 'function') {
      const centered = this.centerRange(range, start)
      if (!centered) start.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }
    this.clearFocus()
    this.activeSubSessionId = subSessionId
    if (supportsCustomHighlight()) {
      this.activeHighlight = new Highlight(range)
      ;(this.doc.defaultView?.CSS ?? CSS).highlights.set(ACTIVE_HIGHLIGHT_NAME, this.activeHighlight)
    }
    this.activeTimer = setTimeout(() => { this.clearFocus() }, 1600)
    return true
  }

  /** Rebuild the shared highlight from the current Range set. */
  private refresh(): void {
    if (!supportsCustomHighlight()) return
    if (this.highlight === null) this.highlight = new Highlight()
    this.highlight.clear()
    for (const range of this.ranges.values()) this.highlight.add(range)
    ;(this.doc.defaultView?.CSS ?? CSS).highlights.set(HIGHLIGHT_NAME, this.highlight)
  }

  /** Fine-center a long paragraph on the selected line after mounting it. */
  private centerRange(range: Range, start: HTMLElement): boolean {
    if (typeof range.getBoundingClientRect !== 'function') return false
    const rect = range.getBoundingClientRect()
    if (rect.height === 0 && rect.width === 0) return false
    const win = this.doc.defaultView
    if (win === null) return false
    // Stock DSH publishes the active conversation scrollport explicitly.
    // Prefer it over style inference so the fixed overlay never steals the
    // scroll target and exact positioning is synchronous/deterministic.
    const conversationScroller = start.closest<HTMLElement>('[data-conversation-scroll]')
    if (conversationScroller !== null) {
      const viewport = conversationScroller.getBoundingClientRect()
      conversationScroller.scrollTop = Math.max(0,
        conversationScroller.scrollTop
        + rect.top
        - viewport.top
        - (viewport.height - rect.height) / 2)
      return true
    }
    let scroller: HTMLElement | null = start.parentElement
    while (scroller !== null) {
      const style = win.getComputedStyle(scroller)
      if (/(auto|scroll|overlay)/u.test(style.overflowY)
        && scroller.scrollHeight > scroller.clientHeight) break
      scroller = scroller.parentElement
    }
    if (scroller !== null && typeof scroller.scrollBy === 'function') {
      const viewport = scroller.getBoundingClientRect()
      scroller.scrollBy({
        top: rect.top - viewport.top - (viewport.height - rect.height) / 2,
        behavior: 'smooth',
      })
      return true
    }
    const pageScroller = this.doc.scrollingElement
    if (pageScroller !== null
      && pageScroller.scrollHeight > pageScroller.clientHeight
      && typeof win.scrollBy === 'function') {
      win.scrollBy({ top: rect.top - (win.innerHeight - rect.height) / 2, behavior: 'smooth' })
      return true
    }
    return false
  }

  private clearFocus(): void {
    if (this.activeTimer !== undefined) clearTimeout(this.activeTimer)
    this.activeTimer = undefined
    this.activeSubSessionId = null
    if (supportsCustomHighlight()) {
      ;(this.doc.defaultView?.CSS ?? CSS).highlights.delete(ACTIVE_HIGHLIGHT_NAME)
    }
    this.activeHighlight = null
  }

  /**
   * Resolve a viewport point to the aside whose exact Range contains it, via
   * caret position resolution. Returns null when the point is outside every
   * highlighted span (or when the browser cannot resolve a caret point).
   */
  hitTest(x: number, y: number): string | null {
    const point = this.caretPoint(x, y)
    if (point === null) return null
    for (const [subSessionId, range] of this.ranges) {
      if (rangeContainsPoint(range, point.node, point.offset)) return subSessionId
    }
    return null
  }

  private caretPoint(x: number, y: number): { node: Node; offset: number } | null {
    const doc = this.doc
    if (typeof doc.caretPositionFromPoint === 'function') {
      const position = doc.caretPositionFromPoint(x, y)
      if (position !== null) return { node: position.offsetNode, offset: position.offset }
    }
    if (typeof doc.caretRangeFromPoint === 'function') {
      const range = doc.caretRangeFromPoint(x, y)
      if (range !== null) return { node: range.startContainer, offset: range.startOffset }
    }
    return null
  }
}

/** Restore one aside's anchor Range inside the given message row, or null. */
export function restoreAnchorRange(row: Element, anchor: AsideAnchor): Range | null {
  return restoreRange(row, anchor)
}
