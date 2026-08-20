/**
 * Exact-text highlight over the parent conversation: restore each aside's
 * anchor Range and paint it with the CSS Custom Highlight API (no `<mark>`
 * wrapping of React-managed text). One shared highlight carries every
 * aside's Range; click identification resolves the point with
 * `caretPositionFromPoint`/`caretRangeFromPoint` and tests membership in
 * each aside's restored Range. Browsers without Custom Highlight fall back to
 * message-level styling; the caller owns that CSS class.
 * @module @ywzhang1031/dsh-client-ui-aside/highlight
 */
import type { AsideAnchor } from '@ywzhang1031/dsh-aside-host/types';
/** The single CSS highlight name shared by every aside's exact highlight. */
export declare const HIGHLIGHT_NAME = "aside-highlight";
/** Short-lived stronger highlight used when the sidebar locates an anchor. */
export declare const ACTIVE_HIGHLIGHT_NAME = "aside-highlight-active";
/** Whether the browser exposes the CSS Custom Highlight API. */
export declare function supportsCustomHighlight(): boolean;
/** Whether a collapsed point (node, offset) lies inside a Range. */
export declare function rangeContainsPoint(range: Range, node: Node, offset: number): boolean;
/**
 * Owns the live set of exact highlight Ranges for one conversation. Re-adding
 * an aside replaces its previous Range (a DOM re-render recovers the span by
 * calling {@link AsideHighlighter.add} again with a freshly restored Range).
 */
export declare class AsideHighlighter {
    private readonly doc;
    private readonly ranges;
    private highlight;
    private activeHighlight;
    private activeTimer;
    private activeSubSessionId;
    constructor(doc: Document);
    /** The set of sub-session ids currently painted exactly. */
    get painted(): ReadonlySet<string>;
    /** Add or replace one aside's exact Range. Returns true when supported. */
    add(subSessionId: string, range: Range): boolean;
    /** Remove one aside's exact Range. */
    remove(subSessionId: string): void;
    /** Remove every exact Range. */
    clear(): void;
    /**
     * Scroll the exact stored span into view and briefly strengthen its paint.
     * Returns false when that span is not currently mounted, so callers can
     * fall back to the containing message row.
     */
    focus(subSessionId: string): boolean;
    /** Rebuild the shared highlight from the current Range set. */
    private refresh;
    /** Fine-center a long paragraph on the selected line after mounting it. */
    private centerRange;
    private clearFocus;
    /**
     * Resolve a viewport point to the aside whose exact Range contains it, via
     * caret position resolution. Returns null when the point is outside every
     * highlighted span (or when the browser cannot resolve a caret point).
     */
    hitTest(x: number, y: number): string | null;
    private caretPoint;
}
/** Restore one aside's anchor Range inside the given message row, or null. */
export declare function restoreAnchorRange(row: Element, anchor: AsideAnchor): Range | null;
//# sourceMappingURL=highlight.d.ts.map