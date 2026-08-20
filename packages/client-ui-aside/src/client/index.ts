/**
 * Aside UI plugin, browser half: the frame-wide side-conversation drawer,
 * the standing Codex-style sidebar (artifacts, sources, aside chats), the
 * prose-selection watcher with its floating ask button, the per-message
 * aside action on the stock `conversation.chat.assistant-actions` strip,
 * and the anchor ledger. A selection is a DRAFT: nothing durable exists
 * until the first question is actually sent — the durable authority (the
 * aside session, its fork lineage, its read-only posture) lives in the Host.
 *
 * Stock-only wiring: the plugin self-mounts its generated Typert Remote stub
 * through `ctx.remote.$mount` (the same API `dsh-api-remotes` uses for the
 * shipped remotes), so no host composition change is needed; session
 * attribution comes from the runtime sessions service instead of DOM
 * attributes, which stock renderers do not publish.
 * @module @ywzhang1031/dsh-client-ui-aside/client
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: the shell.overlay SlotMap declaration (its key's owner).
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
// Type-only: the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: ui-conversation's SlotMap declaration of the
// `conversation.chat.assistant-actions` strip this plugin contributes to.
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
// The generated Remote stub this plugin mounts itself, and the type-only
// Remote method surface (ctx.remote.aside) it carries.
import asideRemote from '@ywzhang1031/dsh-aside-host/remote'
import type {} from '@ywzhang1031/dsh-aside-host/remote'
import type { ConnectionHandle, SessionId } from '@deepseek-ai/dsh-client-connection/client'
import type { AsideCreateResult } from '@ywzhang1031/dsh-aside-host/types'
import { AnchorStore } from './anchors.ts'
import { DrawerStore, openingQuestion } from './drawer-store.ts'
import { SelectionWatcher, type SelectionContext } from './selection.ts'
import { AsideDrawer } from './AsideDrawer.tsx'
import { AsideSidebar, type AsideSidebarSessions } from './AsideSidebar.tsx'
import { AsideAskAction } from './AsideAskAction.tsx'
import { en, zh } from './locales.ts'

export { AnchorStore, type AsideAnchor } from './anchors.ts'
export { DrawerStore, openingQuestion, type DrawerState } from './drawer-store.ts'
export { SelectionWatcher, resolveSelection, MAX_SELECTION_CHARS, MIN_SELECTION_CHARS, type SelectionContext } from './selection.ts'
export { foldArtifacts, foldSources, type SidebarArtifact, type SidebarSource } from './fold.ts'
export { projectHistory, type DrawerRow, AsideDrawer, type AsideDrawerProps } from './AsideDrawer.tsx'
export { AsideSidebar, type AsideSidebarProps, type AsideSidebarSessions } from './AsideSidebar.tsx'
export { AsideAskAction } from './AsideAskAction.tsx'
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
export const inject = ['slots', 'sessions', 'connection', 'remote', 'locale']

/** Stylesheet for the DOM-created floating ask button (theme tokens with fallbacks). */
const FLOATING_BUTTON_CSS = `
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
`

/** Minimal session-observable face of the runtime sessions service. */
interface SessionsFace {
  list: {
    subscribe(listener: () => void): () => void
    getSnapshot(): { current?: string }
  }
}

/** The rendering session id, from the runtime service (stock DOM carries no attribute). */
function currentSession(sessions: unknown): string | null {
  const face = sessions as SessionsFace
  return face.list.getSnapshot().current ?? null
}

/**
 * Client plugin body: one shared anchor ledger and drawer store, the
 * self-mounted Remote stub, the per-message aside action, the overlay drawer
 * and sidebar, and the selection watcher. Selections open a draft; the first
 * send turns it into a real aside (create → anchor → prompt) through
 * {@link sendFirst}.
 * @param ctx - the browser root context.
 */
export async function apply(ctx: ClientContext): Promise<void> {
  const t = ctx.locale.bind(NS)
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-aside: dictionaries')

  const anchors = new AnchorStore()
  const drawer = new DrawerStore()
  const { api } = ctx.get('connection') as ConnectionHandle
  const sessions = ctx.sessions as unknown as SessionsFace

  // Mount the package Remote stub, then capture the namespace service by its
  // Cordis key. Dynamic namespaces are separate services (`remote.aside`),
  // not properties covered by this plugin's static `remote` injection.
  const asideDisposer = await ctx.remote.$mount(asideRemote)
  ctx.effect(() => asideDisposer, 'ui-aside: remote stub unmount')
  const aside = ctx.get('remote.aside') as ClientContext['remote']['aside'] | undefined
  if (aside === undefined) throw new Error('ui-aside: mounted Remote namespace "aside" is unavailable')

  /** Reopen one existing aside from the sidebar or an anchor click. */
  const openExisting = (anchor: { subSessionId: string; sessionId: string; text: string }): void => {
    drawer.openSub({
      subSessionId: anchor.subSessionId,
      parentSessionId: anchor.sessionId,
      anchorText: anchor.text,
    })
  }

  /**
   * The draft's first send: create the forked aside, record the anchor (only
   * now is the prose actually asked about), prompt it with the anchored
   * source attached, and bind the drawer. A failure keeps the draft open
   * with the error surfaced.
   */
  const sendFirst = async (input: string): Promise<boolean> => {
    const draft = drawer.get()
    if (draft.subSessionId !== null || !draft.draft) return false
    const parentSessionId = draft.parentSessionId
    const messageId = draft.messageId
    if (parentSessionId === null) return false
    try {
      const created = await aside.create({ parentSessionId })
      if (!created.ok) throw new Error(created.error.message)
      const result: AsideCreateResult = created.value
      const anchor = anchors.ensure({
        sessionId: parentSessionId,
        ...messageId === null ? {} : { messageId },
        text: draft.anchorText,
        subSessionId: result.sessionId,
      })
      const question = openingQuestion(input, anchor.text)
      const sent = await api.sessions.prompt({
        sessionId: result.sessionId as SessionId,
        mode: 'queue',
        content: [{ type: 'text', text: question }],
      })
      if (!sent.result.ok) throw new Error(sent.result.error.message)
      drawer.attach(result.sessionId)
      return true
    } catch (error) {
      console.error('[aside] first send failed:', error)
      drawer.setError(error instanceof Error ? error.message : String(error))
      return false
    }
  }

  // The side-conversation drawer and the standing sidebar on the frame-wide
  // overlay layer (one generator contribution registers both entries).
  const sidebarSessions: AsideSidebarSessions = {
    subscribe: listener => sessions.list.subscribe(listener),
    getCurrent: () => sessions.list.getSnapshot().current ?? null,
  }
  ctx.slots.inject('shell.overlay', function* () {
    yield ctx.slots.register({
      name: 'shell.overlay',
      id: 'aside-sidebar',
      order: 10,
      inject: () => ({ anchors, sessions: sidebarSessions, api, onOpenAside: openExisting, t }),
    }, AsideSidebar)
    yield ctx.slots.register({
      name: 'shell.overlay',
      id: 'aside-drawer',
      order: 20,
      inject: () => ({ store: drawer, api, onFirstSend: sendFirst, t }),
    }, AsideDrawer)
  })

  // The per-message entry on the stock assistant-actions strip: opens a draft
  // anchored to that message. The strip passes only messageId; the message
  // text is resolved from history so the anchor has a label.
  ctx.slots.inject('conversation.chat.assistant-actions', function* () {
    yield ctx.slots.register({
      name: 'conversation.chat.assistant-actions',
      id: 'aside-ask',
      order: 20,
      inject: () => ({
        api,
        sessions,
        anchors,
        drawer,
        t,
      }),
    }, AsideAskAction)
  })

  // Floating-button stylesheet (the button is created outside React).
  const style = document.createElement('style')
  style.textContent = FLOATING_BUTTON_CSS
  document.head.appendChild(style)
  ctx.effect(() => () => { style.remove() }, 'ui-aside: floating button style')

  /** A selection opens a draft drawer; nothing is created until asked. */
  const ask = (selection: SelectionContext): void => {
    const existing = anchors.find(selection.sessionId, selection.messageId ?? undefined, selection.text)
    if (existing !== undefined) {
      drawer.openSub({
        subSessionId: existing.subSessionId,
        parentSessionId: existing.sessionId,
        anchorText: existing.text,
      })
      return
    }
    drawer.openDraft({
      parentSessionId: selection.sessionId,
      anchorText: selection.text,
      messageId: selection.messageId,
    })
  }

  const watcher = new SelectionWatcher(
    document,
    ask,
    t('askLabel'),
    () => currentSession(sessions),
  )
  ctx.effect(() => watcher.start(), 'ui-aside: selection watcher')
}
