/**
 * Aside UI plugin, browser half: the frame-wide side-conversation drawer, the
 * standing aside sidebar, the prose-selection watcher with its floating ask
 * button, the per-message aside action on the stock
 * `conversation.chat.assistant-actions` strip, and the exact-text highlight
 * layer. A selection is a DRAFT: nothing durable exists until the first
 * question is actually sent — the durable authority (the aside session, its
 * fork lineage, its read-only posture, and the anchor relationship) lives in
 * the Host. The browser only mirrors the Host's `aside.list`/`aside.create`
 * results; there is no `localStorage`.
 *
 * Stock-only wiring: the plugin self-mounts its generated Typert Remote stub
 * through `ctx.remote.$mount` (the same API `dsh-api-remotes` uses for the
 * shipped remotes), so no host composition change is needed; session
 * attribution comes from the runtime sessions service plus history matching
 * (stock renders the assistant-actions strip in a sibling node of the message
 * text, so the selection cannot be attributed by sentinel containment).
 * @module @ywzhang1031/dsh-client-ui-aside/client
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: the shell.overlay SlotMap declaration (its key's owner).
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
// Type-only: the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: ui-conversation's service and SlotMap declaration of the
// `conversation.chat.assistant-actions` strip this plugin contributes to.
import type { IConversation } from '@deepseek-ai/dsh-client-ui-conversation/client'
// The generated Remote stub this plugin mounts itself, and the type-only
// Remote method surface (ctx.remote.aside) it carries.
import asideRemote from '@ywzhang1031/dsh-aside-host/remote'
import type {} from '@ywzhang1031/dsh-aside-host/remote'
import type { ConnectionHandle, SessionId } from '@deepseek-ai/dsh-client-connection/client'
import type { AsideRecord } from '@ywzhang1031/dsh-aside-host/types'
import { AsideRepository } from './repository.ts'
import { DrawerStore } from './drawer-store.ts'
import { SelectionWatcher, resolveMessageId, type SelectionContext } from './selection.ts'
import { MessageDomRegistry, findMessageRowBefore } from './message-dom-registry.ts'
import { ACTIVE_HIGHLIGHT_NAME, AsideHighlighter, HIGHLIGHT_NAME, restoreAnchorRange } from './highlight.ts'
import { findRowContaining } from './quote.ts'
import { AsideDrawer, type AsideModelSelection } from './AsideDrawer.tsx'
import { AsideSidebar, type AsideSidebarSessions } from './AsideSidebar.tsx'
import { AsideAskAction } from './AsideAskAction.tsx'
import { AsideVisibility } from './visibility.ts'
import { en, zh } from './locales.ts'

export { AsideRepository, asideText } from './repository.ts'
export { DrawerStore, type DrawerState } from './drawer-store.ts'
export { SelectionWatcher, resolveSelection, resolveMessageId, MIN_SELECTION_CHARS, MAX_SELECTION_CHARS, type SelectionContext } from './selection.ts'
export { MessageDomRegistry, chatAnchorRow, findMessageRowBefore, type MessageDomEntry } from './message-dom-registry.ts'
export { ACTIVE_HIGHLIGHT_NAME, AsideHighlighter, supportsCustomHighlight, HIGHLIGHT_NAME, restoreAnchorRange } from './highlight.ts'
export { buildQuote, restoreRange, normalizeText, findRowContaining } from './quote.ts'
export { projectHistory, ASIDE_COMMANDS, type AsideModelSelection, type DrawerRow, AsideDrawer, type AsideDrawerProps } from './AsideDrawer.tsx'
export { AsideSidebar, type AsideSidebarProps, type AsideSidebarSessions } from './AsideSidebar.tsx'
export { AsideAskAction } from './AsideAskAction.tsx'
export { AsideVisibility, type AsideWorkspaceFace } from './visibility.ts'
export type { AsideLocaleKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The aside drawer, sidebar, and floating action's copy. */
    'aside': import('./locales.ts').AsideLocaleKey
  }
}

/** Dictionary namespace owned by this plugin. */
export const NS = 'aside'

/** Required services (cordis fiber inject). `remote.aside` is NOT injected: this plugin mounts the stub itself. */
export const inject = ['slots', 'sessions', 'workspaces', 'connection', 'remote', 'locale', 'conversation']

/** Stylesheet for the DOM-created floating ask button and highlight layer. */
const PLUGIN_CSS = `
.aside-ask-button {
  position: fixed;
  z-index: 70;
  display: none;
  padding: 5px 12px;
  border: 1px solid var(--dsw-alias-state-business-primary, rgba(127, 127, 127, 0.4));
  border-radius: 999px;
  background: var(--dsw-alias-surface-background, #ffffff);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.22);
  font: 12px/1.4 system-ui, -apple-system, sans-serif;
  color: var(--dsw-alias-text-primary, #1a1a1a);
  cursor: pointer;
  white-space: nowrap;
}
.aside-ask-button:hover { background: var(--dsw-alias-state-business-weak, #f2f6ff); }
.aside-ask-button:disabled { opacity: 0.85; cursor: wait; }
::highlight(${HIGHLIGHT_NAME}) {
  background-color: color-mix(in srgb, var(--dsw-alias-state-business-primary, #1a6bff) 16%, transparent);
}
::highlight(${ACTIVE_HIGHLIGHT_NAME}) {
  background-color: color-mix(in srgb, var(--dsw-alias-state-business-primary, #1a6bff) 38%, transparent);
  text-decoration: underline 2px var(--dsw-alias-state-business-primary, #1a6bff);
}
.aside-message-anchored {
  box-shadow: inset 2px 0 0 0 var(--dsw-alias-state-business-primary, #1a6bff);
  background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #1a6bff) 5%, transparent);
}
.aside-message-flash {
  animation: aside-message-flash 1.6s ease-out;
}
@keyframes aside-message-flash {
  0% { background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #1a6bff) 24%, transparent); }
  100% { background: transparent; }
}
@media (prefers-reduced-motion: reduce) {
  .aside-message-flash { animation: none; }
}
`

/** Minimal session-observable face of the runtime sessions service. */
interface SessionsFace {
  list: {
    subscribe(listener: () => void): () => void
    getSnapshot(): { current?: string | null }
  }
}

/** The rendering session id, from the runtime service (stock DOM carries no attribute). */
function currentSession(sessions: unknown): string | null {
  const face = sessions as SessionsFace
  return face.list.getSnapshot().current ?? null
}

const FLASH_CLASS = 'aside-message-flash'
const ANCHORED_CLASS = 'aside-message-anchored'
/** Bound old-history pulls for one click; unchanged history stops earlier. */
const MAX_LOCATE_PAGES = 20

/**
 * Client plugin body: one shared repository, drawer store, message DOM
 * registry, and highlight layer, the self-mounted Remote stub, the
 * per-message aside action, the overlay drawer and sidebar, and the selection
 * watcher. Selections open a draft; the first send turns it into a real aside
 * (create → prompt) through {@link sendFirst}.
 * @param ctx - the browser root context.
 */
export async function apply(ctx: ClientContext): Promise<void> {
  const t = ctx.locale.bind(NS)
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-aside: dictionaries')

  const { api } = ctx.get('connection') as ConnectionHandle
  const sessions = ctx.sessions as unknown as SessionsFace

  // Mount the package Remote stub, then capture the namespace service by its
  // Cordis key. Dynamic namespaces are separate services (`remote.aside`),
  // not properties covered by this plugin's static `remote` injection.
  const asideDisposer = await ctx.remote.$mount(asideRemote)
  ctx.effect(() => asideDisposer, 'ui-aside: remote stub unmount')
  const aside = ctx.get('remote.aside') as ClientContext['remote']['aside'] | undefined
  if (aside === undefined) throw new Error('ui-aside: mounted Remote namespace "aside" is unavailable')

  const repository = new AsideRepository(aside)
  const drawer = new DrawerStore()
  const visibility = new AsideVisibility(ctx.workspaces)
  const registry = new MessageDomRegistry()
  const highlighter = new AsideHighlighter(document)
  const rafFn = typeof requestAnimationFrame === 'function'
    ? (cb: FrameRequestCallback) => requestAnimationFrame(cb)
    : (cb: FrameRequestCallback) => setTimeout(cb, 16) as unknown as number
  const cancelRaf = typeof cancelAnimationFrame === 'function'
    ? (id: number) => { cancelAnimationFrame(id) }
    : (id: number) => { clearTimeout(id) }
  let locateGeneration = 0

  /** Let the drawer and a newly prepended history page commit before locating. */
  const settleLayout = (): Promise<void> => new Promise(resolve => {
    rafFn(() => { rafFn(() => { resolve() }) })
  })

  /** The first mounted chat row, used to detect that loadOlder made no progress. */
  const historyHeadKey = (): string | null => (
    document.querySelector<HTMLElement>('[data-conversation-scroll] [data-chat-anchor-key]')
      ?.dataset.chatAnchorKey ?? null
  )

  /** Briefly emphasize one message row (then let the persistent highlight return). */
  const flashMessage = (el: HTMLElement): void => {
    el.classList.add(FLASH_CLASS)
    setTimeout(() => { el.classList.remove(FLASH_CLASS) }, 1600)
  }

  /** Scroll to one exact anchored span, degrading to its parent message. */
  const locateMessage = (record: AsideRecord): boolean => {
    if (highlighter.focus(record.subSessionId)) return true
    const messageId = record.anchor.messageId
    let turnTail: HTMLElement | null = null
    if (messageId !== null) {
      const entry = registry.get(messageId)
      if (entry !== undefined) {
        turnTail = entry.turnTail
        const messageRow = findMessageRowBefore(entry.turnTail, record.anchor.exact)
        const range = messageRow === null ? null : restoreAnchorRange(messageRow, record.anchor)
        if (range !== null) {
          highlighter.add(record.subSessionId, range)
          if (highlighter.focus(record.subSessionId)) return true
        }
      }
    }
    const row = findRowContaining(document, record.anchor.exact)
    if (row !== null) {
      const range = restoreAnchorRange(row, record.anchor)
      if (range !== null) {
        highlighter.add(record.subSessionId, range)
        if (highlighter.focus(record.subSessionId)) return true
      }
      row.scrollIntoView({ block: 'center' })
      flashMessage(row)
      return true
    }
    if (turnTail !== null) {
      turnTail.scrollIntoView({ block: 'center' })
      flashMessage(turnTail)
      return true
    }
    return false
  }

  /** Reopen one existing aside from the sidebar or an anchor click. */
  const openExisting = (record: AsideRecord): void => {
    const generation = ++locateGeneration
    drawer.openSub(record)
    void (async () => {
      // Opening the overlay mutates the frame. Let React and the highlight
      // resync settle, then focus the precise span so that animation survives.
      await settleLayout()
      if (generation !== locateGeneration || currentSession(sessions) !== record.parentSessionId) return
      if (locateMessage(record)) return

      const scoped = ctx.sessions.scope(record.parentSessionId as SessionId)
      const conversation = scoped?.get('conversation') as IConversation | undefined
      if (conversation === undefined) return
      let head = historyHeadKey()
      for (let page = 0; page < MAX_LOCATE_PAGES; page += 1) {
        try {
          await conversation.loadOlder()
        } catch {
          // History paging failure leaves the correctly opened aside usable.
          return
        }
        await settleLayout()
        if (generation !== locateGeneration || currentSession(sessions) !== record.parentSessionId) return
        if (locateMessage(record)) return
        const nextHead = historyHeadKey()
        if (nextHead === head) return
        head = nextHead
      }
    })()
  }

  // A frame-level drawer belongs to exactly one main session. Drop it and any
  // in-flight locate loop as soon as the runtime selects another session.
  let selectedSessionId = currentSession(sessions)
  const offSessionChange = sessions.list.subscribe(() => {
    const nextSessionId = currentSession(sessions)
    if (nextSessionId === selectedSessionId) return
    selectedSessionId = nextSessionId
    locateGeneration += 1
    drawer.close()
  })
  ctx.effect(() => offSessionChange, 'ui-aside: close drawer on session change')

  /**
   * The draft's first send: create the forked aside (the Host persists the
   * anchor into the child's first message), hide its navigation row, prompt
   * it with the question, and
   * bind the drawer. A failure keeps the draft open with the error surfaced;
   * no local anchor is fabricated. If the drawer was closed/reopened mid-flight
   * the created aside still exists (correctly anchored), but it is never bound
   * to the now-different draft.
   */
  const sendFirst = async (input: string, model?: AsideModelSelection): Promise<boolean> => {
    const draft = drawer.get()
    if (draft.subSessionId !== null || !draft.draft || draft.anchor === null || draft.parentSessionId === null) return false
    const parentSessionId = draft.parentSessionId
    const anchor = draft.anchor
    const version = drawer.getVersion()
    try {
      const created = await aside.create({ parentSessionId, anchor })
      if (!created.ok) throw new Error(created.error.message)
      const record: AsideRecord = created.value.record
      // The Host has crossed its durability barrier. Hide this confirmed
      // child from Workspace navigation before prompting it; a hide failure is
      // non-fatal and remains retryable through reconciliation.
      await visibility.hide(record)
      // Draft controls are a local preview of the parent directory. Apply the
      // chosen route only to the durable child, before its first real prompt;
      // the parent conversation is never mutated.
      if (model !== undefined) {
        const selected = await api.sessions.selectModel({
          sessionId: record.subSessionId as SessionId,
          ...model,
        })
        if (!selected.result.ok) throw new Error(selected.result.error.message)
      }
      // The anchor is already durable (appended by the Host at create time);
      // only the question rides this prompt.
      const sent = await api.sessions.prompt({
        sessionId: record.subSessionId as SessionId,
        mode: 'queue',
        content: [{ type: 'text', text: input.trim() }],
      })
      if (!sent.result.ok) throw new Error(sent.result.error.message)
      repository.add(record)
      drawer.attach(record, version)
      return true
    } catch (error) {
      console.error('[aside] first send failed:', error)
      if (drawer.getVersion() === version) drawer.setError(error instanceof Error ? error.message : String(error))
      return false
    }
  }

  // Sidebar + drawer on the frame-wide overlay layer.
  const sidebarSessions: AsideSidebarSessions = {
    subscribe: listener => sessions.list.subscribe(listener),
    getCurrent: () => sessions.list.getSnapshot().current ?? null,
  }
  ctx.slots.inject('shell.overlay', function* () {
    yield ctx.slots.register({
      name: 'shell.overlay',
      id: 'aside-sidebar',
      order: 10,
      inject: () => ({ repository, drawer, sessions: sidebarSessions, onOpenAside: openExisting, t }),
    }, AsideSidebar)
    yield ctx.slots.register({
      name: 'shell.overlay',
      id: 'aside-drawer',
      order: 20,
      inject: () => ({
        store: drawer,
        api,
        onFirstSend: sendFirst,
        t,
      }),
    }, AsideDrawer)
  })

  // The per-message entry on the stock assistant-actions strip.
  ctx.slots.inject('conversation.chat.assistant-actions', function* () {
    yield ctx.slots.register({
      name: 'conversation.chat.assistant-actions',
      id: 'aside-ask',
      order: 20,
      inject: () => ({ api, sessions, repository, drawer, registry, t }),
    }, AsideAskAction)
  })

  // Stylesheet (floating button, highlight, flash, message-level fallback).
  const style = document.createElement('style')
  style.textContent = PLUGIN_CSS
  document.head.appendChild(style)
  ctx.effect(() => () => { style.remove() }, 'ui-aside: plugin stylesheet')

  /** Rebuild the exact highlights from the current session's records. */
  const syncHighlights = (): void => {
    highlighter.clear()
    for (const el of [...document.querySelectorAll(`.${ANCHORED_CLASS}`)]) el.classList.remove(ANCHORED_CLASS)
    for (const record of repository.list()) {
      const entry = record.anchor.messageId === null ? undefined : registry.get(record.anchor.messageId)
      const messageRow = entry === undefined ? null : findMessageRowBefore(entry.turnTail, record.anchor.exact)
      const row = messageRow ?? findRowContaining(document, record.anchor.exact) ?? entry?.turnTail
      if (row === null || row === undefined) continue
      const range = restoreAnchorRange(row, record.anchor)
      const highlighted = range !== null && highlighter.add(record.subSessionId, range)
      if (!highlighted) row.classList.add(ANCHORED_CLASS)
    }
  }

  // Re-sync highlights on repository changes and on conversation DOM updates
  // (debounced through a single rAF; never a full scan per mutation).
  let raf = 0
  const scheduleSync = (): void => {
    if (raf !== 0) return
    raf = rafFn(() => {
      raf = 0
      syncHighlights()
    })
  }
  const reconcileVisibility = (): void => { visibility.reconcile(repository.list()) }
  const offRepo = repository.subscribe(() => {
    scheduleSync()
    reconcileVisibility()
  })
  const offWorkspaces = ctx.workspaces.list.subscribe(reconcileVisibility)
  const observer = new MutationObserver(scheduleSync)
  observer.observe(document.body, { childList: true, subtree: true })
  ctx.effect(() => () => {
    offRepo()
    offWorkspaces()
    observer.disconnect()
    if (raf !== 0) cancelRaf(raf)
  }, 'ui-aside: highlight sync')

  // Clicking a highlighted span opens its aside (capture phase, plain clicks).
  const onClick = (event: MouseEvent): void => {
    const selection = document.getSelection()
    if (selection !== null && !selection.isCollapsed) return
    const subSessionId = highlighter.hitTest(event.clientX, event.clientY)
    if (subSessionId === null) return
    const record = repository.findSub(subSessionId)
    if (record === undefined) return
    event.preventDefault()
    event.stopPropagation()
    openExisting(record)
  }
  document.addEventListener('click', onClick, true)
  ctx.effect(() => () => { document.removeEventListener('click', onClick, true) }, 'ui-aside: highlight click')

  /** A selection opens a draft drawer; nothing is created until asked. */
  const ask = async (selection: SelectionContext): Promise<void> => {
    let messageId: string | null = null
    try {
      const history = await api.sessions.history({ sessionId: selection.sessionId as SessionId, maxMessages: 100 })
      if (history.result.ok) messageId = resolveMessageId(history.result.value.events, selection.anchor.exact)
    } catch {
      // History read failure: keep messageId null; the aside still works.
    }
    const anchor = { ...selection.anchor, messageId }
    const existing = repository.find(selection.sessionId, anchor)
    if (existing !== undefined) {
      openExisting(existing)
      return
    }
    drawer.openDraft({ parentSessionId: selection.sessionId, anchor })
  }

  const watcher = new SelectionWatcher(
    document,
    ask,
    t('askLabel'),
    () => currentSession(sessions),
  )
  ctx.effect(() => watcher.start(), 'ui-aside: selection watcher')

  // Initial highlight sync once the frame settles.
  scheduleSync()
}
