/**
 * Quote selector: build and restore the precise character span an aside is
 * anchored to, across Markdown's inline element boundaries. The anchor keeps
 * `exact` (the selected prose), `prefix`/`suffix` (surrounding text for
 * disambiguation), `occurrence` (1-based index among identical matches) and
 * `startOffset` (character offset inside the message's plain text). None of
 * these is a sole source of truth — restore tries raw then whitespace-
 * normalized matching and degrades gracefully.
 * @module dsh-client-ui-aside/quote
 */
import type { AsideAnchor } from 'dsh-aside-host/types';
/** A text node plus its character offsets inside a message's concatenated text. */
export interface TextSpan {
    node: Text;
    start: number;
    end: number;
}
/** Collapse every whitespace run to one space and trim (matching normalizer). */
export declare function normalizeText(text: string): string;
/** Walk a message subtree and return its text nodes plus the concatenated text. */
export declare function collectTextSpans(root: Node): {
    text: string;
    spans: TextSpan[];
};
/**
 * Build the disambiguation fields for a selection range inside one message.
 * Returns null when the range carries no usable text.
 */
export declare function buildQuote(messageEl: Element, range: Range): Omit<AsideAnchor, 'messageId'> | null;
/**
 * Restore the Range an anchor describes inside one message element. Tries the
 * recorded occurrence, then prefix/suffix disambiguation, then normalized
 * matching. Returns null when no reliable span can be found.
 */
export declare function restoreRange(messageEl: Element, anchor: AsideAnchor): Range | null;
/**
 * Find the chat-anchor row (one rendered message node) whose text contains
 * the anchor's exact prose. Used to scope exact-text restoration to a single
 * message. Falls back to null when no row contains it (the caller then
 * degrades to message-level positioning).
 */
export declare function findRowContaining(root: ParentNode, exact: string): HTMLElement | null;
/**
 * Restore the Range for an anchor by first locating the message row that
 * contains its exact text, then narrowing within that row. Returns null when
 * either the row or the precise span cannot be recovered.
 */
export declare function restoreInConversation(root: ParentNode, anchor: AsideAnchor): Range | null;
//# sourceMappingURL=quote.d.ts.map