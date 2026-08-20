/**
 * Side-conversation drawer over the frame-wide overlay slot: a compact
 * read-only chat panel. It opens as a DRAFT bound to one prose selection
 * (empty composer); the first send creates the forked aside, asks the
 * question with the anchored source attached, and only then does the
 * selection become a highlightable anchor. Closing an unanswered draft
 * leaves nothing behind. Existing asides reopen for follow-up questions.
 * @module @ywzhang1031/dsh-client-ui-aside/AsideDrawer
 */

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { IApiClient, SessionId } from '@deepseek-ai/dsh-client-connection/client'
import { MarkdownText } from '@deepseek-ai/dsh-client-ui-primitives'
import { DrawerStore, type DrawerState } from './drawer-store.ts'
import type { AsideLocaleKey } from './locales.ts'
import css from './AsideDrawer.module.css'

/** One display row projected from the raw history events. */
export type DrawerRow =
  | { readonly kind: 'user'; readonly text: string }
  | { readonly kind: 'assistant'; readonly text: string }
  | { readonly kind: 'tool'; readonly name: string }

/**
 * Project raw history events into display rows: user/assistant surface
 * messages and tool-call heads; every other event type is invisible.
 * `assistant/message` carries its message nested under `data.message`
 * (the canonical event shape), while `user/message` is the message itself.
 */
export function projectHistory(entries: readonly { event: { type: string; data?: unknown } }[]): DrawerRow[] {
  const rows: DrawerRow[] = []
  const textOf = (blocks: unknown): string => (
    (Array.isArray(blocks) ? blocks : [])
      .filter((block): block is { type: string; text?: string } => (
        typeof block === 'object' && block !== null && (block as { type?: unknown }).type === 'text'
      ))
      .map(block => block.text ?? '')
      .join('\n')
      .trim()
  )
  for (const entry of entries) {
    const event = entry.event
    if (event.type === 'user/message') {
      const data = event.data as { content?: unknown } | undefined
      const text = textOf(data?.content)
      if (text === '') continue
      rows.push({ kind: 'user', text })
    } else if (event.type === 'assistant/message') {
      const data = event.data as { message?: { content?: unknown } } | undefined
      const text = textOf(data?.message?.content)
      if (text === '') continue
      rows.push({ kind: 'assistant', text })
    } else if (event.type === 'tool/call') {
      const data = event.data as { name?: string } | undefined
      if (data?.name !== undefined) rows.push({ kind: 'tool', name: data.name })
    }
  }
  return rows
}

export interface AsideDrawerProps {
  /** The plugin-owned open-state store (single instance). */
  store: DrawerStore
  /** Shared connection API client (history/prompt). */
  api: IApiClient
  /**
   * The draft's first send: create the forked aside, record the anchor, and
   * prompt it with the anchored source attached. Resolves true on success
   * (the store is already attached), false when creation or prompt failed.
   */
  onFirstSend: (input: string) => Promise<boolean>
  /** Locale binder for this surface's dictionary. */
  t: (key: AsideLocaleKey, vars?: Record<string, string>) => string
}

const POLL_MS = 800

export function AsideDrawer({ store, api, onFirstSend, t }: AsideDrawerProps): React.ReactNode {
  const state: DrawerState = useSyncExternalStore(
    listener => store.subscribe(listener),
    () => store.get(),
  )
  const subSessionId = state.subSessionId
  const [rows, setRows] = useState<DrawerRow[]>([])
  const [value, setValue] = useState('')
  const [sending, setSending] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  // Focus the composer when the drawer opens; never prefill (the draft is
  // deliberately empty — the selected span attaches only when asked).
  useEffect(() => {
    if (subSessionId === null && !state.draft) return
    setValue('')
    inputRef.current?.focus()
  }, [subSessionId, state.draft])

  // Load + lightly poll the aside history while the drawer stays open.
  useEffect(() => {
    if (subSessionId === null) {
      setRows([])
      setLoaded(false)
      return
    }
    let disposed = false
    const refresh = async (): Promise<void> => {
      try {
        const response = await api.sessions.history({
          sessionId: subSessionId as SessionId,
          maxMessages: 100,
        })
        if (disposed) return
        if (response.result.ok) {
          setRows(projectHistory(response.result.value.events))
        }
      } catch {
        // Transient read failure: keep the last rows; the next tick retries.
      } finally {
        if (!disposed) setLoaded(true)
      }
    }
    void refresh()
    const timer = setInterval(() => { void refresh() }, POLL_MS)
    return () => {
      disposed = true
      clearInterval(timer)
    }
  }, [subSessionId, api])

  const send = async (): Promise<void> => {
    if (sending || value.trim() === '') return
    setSending(true)
    try {
      if (state.draft || subSessionId === null) {
        const ok = await onFirstSend(value)
        if (ok) setValue('')
        return
      }
      const response = await api.sessions.prompt({
        sessionId: subSessionId as SessionId,
        mode: 'queue',
        content: [{ type: 'text', text: value }],
      })
      if (!response.result.ok) {
        store.setError(response.result.error.message)
        return
      }
      setValue('')
      // Immediate refresh so the admitted message appears without the tick.
      const history = await api.sessions.history({ sessionId: subSessionId as SessionId, maxMessages: 100 })
      if (history.result.ok) setRows(projectHistory(history.result.value.events))
    } catch (error) {
      store.setError(error instanceof Error ? error.message : String(error))
    } finally {
      setSending(false)
    }
  }

  const title = useMemo(() => {
    const compact = state.anchorText.replace(/\s+/g, ' ').trim()
    return compact.length > 40 ? `${compact.slice(0, 40)}…` : compact
  }, [state.anchorText])

  if (subSessionId === null && !state.draft) return null

  return (
    <aside className={css.drawer} role="dialog" aria-label={t('title')}>
      <header className={css.header}>
        <div className={css.titleRow}>
          <h2 className={css.title} title={state.anchorText}>{title}</h2>
          <span className={css.readonlyBadge}>{t('readonlyBadge')}</span>
        </div>
        <p className={css.hint}>{t('readonlyHint')}</p>
        <button type="button" className={css.close} aria-label={t('close')} onClick={() => { store.close() }}>×</button>
      </header>

      {state.error !== null && <p className={css.error} role="alert">{t('error', { message: state.error })}</p>}

      <div className={css.messages}>
        {state.draft && <p className={css.status}>{t('draftHint')}</p>}
        {!state.draft && !loaded && rows.length === 0 && <p className={css.status}>{t('loading')}</p>}
        {!state.draft && loaded && rows.length === 0 && <p className={css.status}>{t('empty')}</p>}
        {rows.map((row, index) => (
          <div key={index} className={css.row} data-row-kind={row.kind}>
            {row.kind === 'tool' ? (
              <span className={css.toolRow}>🔍 {row.name}</span>
            ) : (
              <>
                <span className={css.role}>{row.kind === 'user' ? t('userRole') : t('assistantRole')}</span>
                {row.kind === 'assistant'
                  ? <MarkdownText text={row.text} />
                  : <p className={css.userText}>{row.text}</p>}
              </>
            )}
          </div>
        ))}
      </div>

      <div className={css.composer}>
        <textarea
          ref={inputRef}
          className={css.input}
          value={value}
          placeholder={t('placeholder')}
          onChange={(event) => { setValue(event.currentTarget.value) }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              void send()
            }
          }}
        />
        <button type="button" className={css.send} disabled={sending || value.trim() === ''} onClick={() => { void send() }}>
          {sending ? t('sending') : t('send')}
        </button>
      </div>
    </aside>
  )
}
