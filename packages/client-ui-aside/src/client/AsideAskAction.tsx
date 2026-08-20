/**
 * The per-message aside entry on the stock `conversation.chat.assistant-actions`
 * strip: one click opens a draft drawer anchored to that assistant message.
 * The action also registers its DOM (turn-tail row + sentinel) with the
 * {@link MessageDomRegistry} so the sidebar can scroll back to this message.
 * The message text is resolved from history; clicking an already-asked
 * message reopens its aside.
 * @module @ywzhang1031/dsh-client-ui-aside/AsideAskAction
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import type { IApiClient, MessageId, SessionId } from '@deepseek-ai/dsh-client-connection/client'
import type { AsideAnchor } from '@ywzhang1031/dsh-aside-host/types'
import { Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
import type { AsideLocaleKey } from './locales.ts'
import type { AsideRepository } from './repository.ts'
import type { DrawerStore } from './drawer-store.ts'
import { MessageDomRegistry, chatAnchorRow, findMessageRowBefore } from './message-dom-registry.ts'
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
  messageId: MessageId
}

export interface AsideAskActionProps extends AsideAskOwnerProps {
  messageId: MessageId
  /** Shared connection API client (history). */
  api: IApiClient
  /** Runtime sessions service (current session). */
  sessions: AsideAskSessions
  /** The plugin-owned Host-backed aside cache. */
  repository: AsideRepository
  /** The plugin-owned drawer open-state store. */
  drawer: DrawerStore
  /** The plugin-owned message DOM registry. */
  registry: MessageDomRegistry
  /** Locale binder for this surface's dictionary. */
  t: (key: AsideLocaleKey, vars?: Record<string, string>) => string
}

/** Extract the plain text of a content-block array. */
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
 * Build a whole-message anchor against rendered text. The closing answer is
 * normally the last occurrence because Think may quote it first.
 */
export function messageAnchor(messageId: string, exact: string, rendered = ''): AsideAnchor {
  const startOffset = rendered.lastIndexOf(exact)
  if (startOffset === -1) {
    return { messageId, exact, prefix: '', suffix: '', occurrence: null, startOffset: null }
  }
  let occurrence = 0
  let offset = rendered.indexOf(exact)
  while (offset !== -1 && offset <= startOffset) {
    occurrence += 1
    offset = rendered.indexOf(exact, offset + exact.length)
  }
  return {
    messageId,
    exact,
    prefix: rendered.slice(Math.max(0, startOffset - 60), startOffset),
    suffix: rendered.slice(startOffset + exact.length, startOffset + exact.length + 60),
    occurrence,
    startOffset,
  }
}

/**
 * One click: resolve the current session, find the message's text in history,
 * then open a draft (or reopen the existing aside for an already-asked span).
 */
export function AsideAskAction({ messageId, api, sessions, repository, drawer, registry, t }: AsideAskActionProps) {
  const [busy, setBusy] = useState(false)
  const alive = useRef(true)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  // Register this message's DOM so the sidebar can locate it; unregister on unmount.
  useEffect(() => {
    const sentinel = buttonRef.current
    if (sentinel === null) return
    const turnTail = chatAnchorRow(sentinel) ?? sentinel
    return registry.register(String(messageId), { sentinel, turnTail })
  }, [messageId, registry])

  useEffect(() => () => { alive.current = false }, [])

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
      const entry = registry.get(String(messageId))
      const row = entry === undefined ? null : findMessageRowBefore(entry.turnTail, text)
      const anchor = messageAnchor(String(messageId), text, row?.textContent ?? '')
      const existing = repository.find(sessionId, anchor)
      if (existing !== undefined) {
        drawer.openSub(existing)
        return
      }
      drawer.openDraft({ parentSessionId: sessionId, anchor })
    } catch (error) {
      console.error('[aside] ask action failed:', error)
    } finally {
      if (alive.current) setBusy(false)
    }
  }, [alive, api, busy, drawer, messageId, repository, sessions])

  const label = t('askMessageLabel')
  return (
    <Tooltip label={label} side="bottom">
      <button
        ref={buttonRef}
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
