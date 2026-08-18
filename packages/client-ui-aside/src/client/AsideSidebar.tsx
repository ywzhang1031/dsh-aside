/**
 * Codex-style frame sidebar: a standing right rail with three sections —
 * produced files, web-search sources, and the aside chats anchored into the
 * current main conversation. Artifacts open through the Host path opener;
 * sources open in a new tab; aside entries reopen their side conversation in
 * the drawer (the same target as an inline anchor click).
 * @module @deepseek-ai/dsh-client-ui-aside/AsideSidebar
 */

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import type { IApiClient, SessionId } from '@deepseek-ai/dsh-client-connection/client'
import { AnchorStore, type AsideAnchor } from './anchors.ts'
import { foldArtifacts, foldSources, type SidebarArtifact, type SidebarSource } from './fold.ts'
import type { AsideLocaleKey } from './locales.ts'
import css from './AsideSidebar.module.css'

/** The current session + list observable the sidebar derives from. */
export interface AsideSidebarSessions {
  subscribe(listener: () => void): () => void
  getCurrent(): string | null
}

export interface AsideSidebarProps {
  /** The plugin-owned anchor ledger (aside chat entries per session). */
  anchors: AnchorStore
  /** Current-session observable (the runtime sessions service). */
  sessions: AsideSidebarSessions
  /** Shared connection API client (history reads, host path opener). */
  api: IApiClient
  /** Reopen one existing aside in the drawer. */
  onOpenAside: (anchor: AsideAnchor) => void
  /** Locale binder for this surface's dictionary. */
  t: (key: AsideLocaleKey, vars?: Record<string, string>) => string
}

const REFRESH_MS = 5000

type SectionKey = 'artifacts' | 'sources' | 'asides'

export function AsideSidebar({ anchors, sessions, api, onOpenAside, t }: AsideSidebarProps): React.ReactNode {
  const sessionId = useSyncExternalStore(
    listener => sessions.subscribe(listener),
    () => sessions.getCurrent(),
  )
  const anchorVersion = useSyncExternalStore(
    listener => anchors.subscribe(listener),
    () => anchors.getVersion(),
  )
  const [artifacts, setArtifacts] = useState<SidebarArtifact[]>([])
  const [sources, setSources] = useState<SidebarSource[]>([])
  const [open, setOpen] = useState<ReadonlySet<SectionKey>>(() => new Set(['asides']))

  const asideEntries = useMemo(
    () => sessionId === null ? [] : [...anchors.list(sessionId)],
    [anchors, sessionId, anchorVersion],
  )

  // Fold the current main conversation's produced files and search sources,
  // refreshing on a light cadence while the session stays selected.
  useEffect(() => {
    if (sessionId === null) {
      setArtifacts([])
      setSources([])
      return
    }
    let disposed = false
    const refresh = async (): Promise<void> => {
      try {
        const response = await api.sessions.history({ sessionId: sessionId as SessionId, maxMessages: 200 })
        if (disposed || !response.result.ok) return
        setArtifacts(foldArtifacts(response.result.value.events))
        setSources(foldSources(response.result.value.events))
      } catch {
        // Transient read failure: keep the last folds; the next tick retries.
      }
    }
    void refresh()
    const timer = setInterval(() => { void refresh() }, REFRESH_MS)
    return () => {
      disposed = true
      clearInterval(timer)
    }
  }, [sessionId, api])

  const toggle = (key: SectionKey): void => {
    setOpen((current) => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const openArtifact = (path: string): void => {
    // Loopback-only privileged RPC; failures stay silent like the tool rows.
    void (api as unknown as { host?: { openPath?(payload: { path: string }): Promise<unknown> } })
      .host?.openPath?.({ path })
      .catch(() => {})
  }

  const openSource = (url: string): void => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <nav className={css.sidebar} aria-label={t('sidebarLabel')}>
      <section className={css.section}>
        <button type="button" className={css.sectionHead} aria-expanded={open.has('asides')} onClick={() => { toggle('asides') }}>
          <span>{t('asidesTitle')}</span>
          <span className={css.count}>{asideEntries.length}</span>
        </button>
        {open.has('asides') && (
          <ul className={css.list}>
            {asideEntries.length === 0 && <li className={css.empty}>{t('asidesEmpty')}</li>}
            {asideEntries.map(anchor => (
              <li key={anchor.subSessionId}>
                <button
                  type="button"
                  className={css.asideEntry}
                  title={anchor.text}
                  onClick={() => { onOpenAside(anchor) }}
                >
                  <span className={css.asideText}>{anchor.text.replace(/\s+/g, ' ').slice(0, 60)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={css.section}>
        <button type="button" className={css.sectionHead} aria-expanded={open.has('artifacts')} onClick={() => { toggle('artifacts') }}>
          <span>{t('artifactsTitle')}</span>
          <span className={css.count}>{artifacts.length}</span>
        </button>
        {open.has('artifacts') && (
          <ul className={css.list}>
            {artifacts.length === 0 && <li className={css.empty}>{t('artifactsEmpty')}</li>}
            {artifacts.map(artifact => (
              <li key={artifact.path}>
                <button
                  type="button"
                  className={css.artifactEntry}
                  title={artifact.path}
                  onClick={() => { openArtifact(artifact.path) }}
                >
                  📄 {artifact.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={css.section}>
        <button type="button" className={css.sectionHead} aria-expanded={open.has('sources')} onClick={() => { toggle('sources') }}>
          <span>{t('sourcesTitle')}</span>
          <span className={css.count}>{sources.length}</span>
        </button>
        {open.has('sources') && (
          <ul className={css.list}>
            {sources.length === 0 && <li className={css.empty}>{t('sourcesEmpty')}</li>}
            {sources.map(source => (
              <li key={source.url}>
                <a
                  className={css.sourceEntry}
                  href={source.url}
                  title={source.meta ?? source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => {
                    event.preventDefault()
                    openSource(source.url)
                  }}
                >
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </nav>
  )
}
