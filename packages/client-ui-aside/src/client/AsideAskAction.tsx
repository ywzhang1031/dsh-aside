/**
 * The per-message aside entry on the stock `conversation.chat.assistant-actions`
 * strip: one click opens a draft drawer anchored to that assistant message —
 * a stock-native entry point that carries the message's exact `messageId`
 * (the selection watcher cannot see one, because stock renderers publish no
 * message DOM identity). The message text is resolved from history so the
 * anchor has a label; clicking an already-asked message reopens its aside.
 * @module @ywzhang1031/dsh-client-ui-aside/AsideAskAction
 */

import { useCallback, useRef, useState } from 'react'
import type { IApiClient, MessageId, SessionId } from '@deepseek-ai/dsh-client-connection/client'
import { Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
import type { AsideLocaleKey } from './locales.ts'
import type { AnchorStore } from './anchors.ts'
import type { DrawerStore } from './drawer-store.ts'
import css from './AsideAskAction.module.css'

/** The narrow sessions-service face the action reads the current session from. */
export interface AsideAskSessions {
  list: {
    subscribe(listener: () => void): () => void
    getSnapshot(): { current?: string | null }
  }
}

/**
 * The stock owner identity of one finalized assistant message (structurally
 * identical to ui-conversation's `AssistantActionOwnerProps`, which stock
 * does not re-export through its client entry).
 */
export interface AsideAskOwnerProps {
  /** Stable identity carried from the `assistant/message` event. */
  messageId: MessageId
}

export interface AsideAskActionProps extends AsideAskOwnerProps {
  /** Stock owner identity of the finalized assistant message. */
  messageId: MessageId
  /** Shared connection API client (history). */
  api: IApiClient
  /** Runtime sessions service (current session). */
  sessions: AsideAskSessions
  /** The plugin-owned anchor ledger. */
  anchors: AnchorStore
  /** The plugin-owned drawer open-state store. */
  drawer: DrawerStore
  /** Locale binder for this surface's dictionary. */
  t: (key: AsideLocaleKey, vars?: Record<string, string>) => string
}

/** Extract the plain text of a content-block array (same projection as the drawer). */
function textOf(blocks: unknown): string {
  return (Array.isArray(blocks) ? blocks : [])
    .filter((block): block is { type: string; text?: string } => (
      typeof block === 'object' && block !== null && (block as { type?: unknown }).type === 'text'
    ))
    .map(block => block.text ?? '')
    .join('\n')
    .trim()
}

/**
 * One click: resolve the current session, find the message's text in history,
 * then open a draft (or reopen the existing aside for an already-asked span).
 */
export function AsideAskAction({ messageId, api, sessions, anchors, drawer, t }: AsideAskActionProps) {
  const [busy, setBusy] = useState(false)
  const alive = useRef(true)
  const resolve = useCallback(async (): Promise<void> => {
    const sessionId = sessions.list.getSnapshot().current
    if (sessionId === undefined || sessionId === null || busy) return
    setBusy(true)
    try {
      const history = await api.sessions.history({ sessionId: sessionId as SessionId, maxMessages: 100 })
      if (!alive.current) return
      if (!history.result.ok) throw new Error(history.result.error.message)
      let text = ''
      for (const entry of history.result.value.events) {
        const event = entry.event
        if (event.type !== 'assistant/message') continue
        const data = event.data as { message?: { id?: unknown; content?: unknown } } | undefined
        if (data?.message?.id !== messageId) continue
        text = textOf(data.message.content)
        break
      }
      if (text === '') throw new Error('message not found in history')
      const existing = anchors.find(sessionId, messageId, text)
      if (existing !== undefined) {
        drawer.openSub({
          subSessionId: existing.subSessionId,
          parentSessionId: existing.sessionId,
          anchorText: existing.text,
        })
        return
      }
      drawer.openDraft({ parentSessionId: sessionId, anchorText: text, messageId })
    } catch (error) {
      console.error('[aside] ask action failed:', error)
    } finally {
      if (alive.current) setBusy(false)
    }
  }, [alive, anchors, api, busy, drawer, messageId, sessions])

  const label = t('askMessageLabel')
  return (
    <Tooltip label={label} side="bottom">
      <button
        type="button"
        className={css.action}
        aria-label={label}
        disabled={busy}
        onClick={() => { void resolve() }}
      >
        💬
      </button>
    </Tooltip>
  )
}
