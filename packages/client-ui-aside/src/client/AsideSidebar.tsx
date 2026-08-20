/**
 * Frame sidebar: a standing right rail listing the aside chats anchored into
 * the current main conversation. Each entry opens its side conversation in
 * the drawer and locates the parent message. The list comes from the Host
 * repository cache (no localStorage, no history polling); switching the
 * parent session triggers one `aside.list` refresh.
 * @module dsh-client-ui-aside/AsideSidebar
 */

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import type { AsideRecord } from 'dsh-aside-host/types'
import { AsideRepository, asideText } from './repository.ts'
import { DrawerStore } from './drawer-store.ts'
import type { AsideLocaleKey } from './locales.ts'
import css from './AsideSidebar.module.css'

/** The current session + list observable the sidebar derives from. */
export interface AsideSidebarSessions {
  subscribe(listener: () => void): () => void
  getCurrent(): string | null
}

export interface AsideSidebarProps {
  /** The plugin-owned Host-backed aside cache. */
  repository: AsideRepository
  /** Drawer state, used to mark the currently open aside row. */
  drawer: DrawerStore
  /** Current-session observable (the runtime sessions service). */
  sessions: AsideSidebarSessions
  /** Reopen one existing aside (open drawer + locate parent message). */
  onOpenAside: (record: AsideRecord) => void
  /** Locale binder for this surface's dictionary. */
  t: (key: AsideLocaleKey, vars?: Record<string, string>) => string
}

/** Compact locale-aware timestamp for one sidebar row. */
export function formatAsideTime(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date(timestamp))
}

export function AsideSidebar({ repository, drawer, sessions, onOpenAside, t }: AsideSidebarProps): React.ReactNode {
  const sessionId = useSyncExternalStore(
    listener => sessions.subscribe(listener),
    () => sessions.getCurrent(),
  )
  const version = useSyncExternalStore(
    listener => repository.subscribe(listener),
    () => repository.getVersion(),
  )
  const drawerVersion = useSyncExternalStore(
    listener => drawer.subscribe(listener),
    () => drawer.getVersion(),
  )
  const [open, setOpen] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (sessionId === null) {
      repository.clear()
      setLoading(false)
      return
    }
    let disposed = false
    setLoading(true)
    void repository.refresh(sessionId).finally(() => {
      if (!disposed) setLoading(false)
    })
    return () => {
      disposed = true
    }
  }, [sessionId, repository])

  const entries = useMemo(() => {
    void version
    return [...repository.list()].sort((left, right) => right.updatedAt - left.updatedAt)
  }, [repository, version])
  void drawerVersion
  const activeSubSessionId = drawer.get().subSessionId

  return (
    <nav className={css.sidebar} aria-label={t('sidebarLabel')}>
      <section className={css.section}>
        <button
          type="button"
          className={css.sectionHead}
          aria-expanded={open}
          onClick={() => { setOpen(current => !current) }}
        >
          <span>{t('asidesTitle')}</span>
          <span className={css.count}>{entries.length}</span>
        </button>
        {open && (
          <ul className={css.list}>
            {loading && entries.length === 0 && <li className={css.empty}>{t('asidesLoading')}</li>}
            {!loading && entries.length === 0 && <li className={css.empty}>{t('asidesEmpty')}</li>}
            {entries.map(record => (
              <li key={record.subSessionId}>
                <button
                  type="button"
                  className={`${css.asideEntry}${record.subSessionId === activeSubSessionId ? ` ${css.active}` : ''}`}
                  title={record.anchor.exact}
                  aria-label={`${t('openAside')}: ${asideText(record)}`}
                  aria-current={record.subSessionId === activeSubSessionId ? 'true' : undefined}
                  onClick={() => { onOpenAside(record) }}
                >
                  <span className={css.asideText}>{asideText(record)}</span>
                  <time
                    className={css.asideTime}
                    dateTime={new Date(record.updatedAt).toISOString()}
                    title={new Date(record.updatedAt).toLocaleString()}
                  >
                    {t('updatedAt', { time: formatAsideTime(record.updatedAt) })}
                  </time>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </nav>
  )
}
