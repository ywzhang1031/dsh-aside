/**
 * Aside anchor persistence: the mapping from an asked-about prose span to
 * its read-only side conversation, kept in browser localStorage so anchors
 * survive reloads. This is client-only presentation state — the durable
 * authority (parent lineage, aside lineage) lives in the session logs; a
 * lost anchor store degrades to anchors that simply no longer list, while
 * the side conversations stay reachable from the session list.
 * @module @deepseek-ai/dsh-client-ui-aside/anchors
 */

/** One anchored span in a main conversation. */
export interface AsideAnchor {
  /** The main conversation the text was asked about in. */
  sessionId: string
  /** The assistant message the question came from, when known (idempotence key). */
  messageId?: string
  /** The asked-about text, exactly as recorded. */
  text: string
  /** The read-only side conversation answering this span. */
  subSessionId: string
  /** Unix epoch ms the anchor was created. */
  createdAt: number
}

const STORAGE_KEY = 'dsh-aside-anchors'

/** Read the persisted record list, degrading to empty on any corruption. */
function readRecords(storage: Storage | undefined): AsideAnchor[] {
  if (storage === undefined) return []
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (raw === null) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((entry): entry is AsideAnchor => (
      typeof entry === 'object' && entry !== null
      && typeof (entry as AsideAnchor).sessionId === 'string'
      && ((entry as AsideAnchor).messageId === undefined || typeof (entry as AsideAnchor).messageId === 'string')
      && typeof (entry as AsideAnchor).text === 'string'
      && typeof (entry as AsideAnchor).subSessionId === 'string'
      && typeof (entry as AsideAnchor).createdAt === 'number'
    ))
  } catch {
    return []
  }
}

/**
 * Mutable anchor ledger with persistence and change subscription. One
 * instance per browser application (the plugin owns it).
 */
export class AnchorStore {
  private records: AsideAnchor[]
  private version = 0
  private readonly listeners = new Set<() => void>()

  constructor(private readonly storage: Storage | undefined = defaultStorage()) {
    this.records = readRecords(this.storage)
  }

  /** Monotonic change counter; renderers subscribe and re-derive on bump. */
  getVersion(): number {
    return this.version
  }

  /** Every anchor, optionally narrowed to one main conversation. */
  list(sessionId?: string): readonly AsideAnchor[] {
    return sessionId === undefined
      ? this.records
      : this.records.filter(record => record.sessionId === sessionId)
  }

  /** The anchor an identical (session, message?, text) span already created, if any. */
  find(sessionId: string, messageId: string | undefined, text: string): AsideAnchor | undefined {
    return this.records.find(record => record.sessionId === sessionId
      && record.messageId === messageId
      && record.text === text)
  }

  /** The anchor an aside id already answers, if any. */
  findSub(subSessionId: string): AsideAnchor | undefined {
    return this.records.find(record => record.subSessionId === subSessionId)
  }

  /**
   * Idempotently create an anchor: an identical (session, message, text) span
   * returns the existing record instead of creating a second side
   * conversation. Persists and notifies on creation only.
   */
  ensure(record: Omit<AsideAnchor, 'createdAt'>): AsideAnchor {
    const existing = this.find(record.sessionId, record.messageId, record.text)
    if (existing !== undefined) return existing
    const created: AsideAnchor = { ...record, createdAt: Date.now() }
    this.records = [...this.records, created]
    this.persist()
    this.notify()
    return created
  }

  /** Subscribe to anchor-set changes (creation only in the current surface). */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  private persist(): void {
    try {
      this.storage?.setItem(STORAGE_KEY, JSON.stringify(this.records))
    } catch {
      // Quota/private-mode failures keep the in-memory ledger working.
    }
  }

  private notify(): void {
    this.version += 1
    for (const listener of [...this.listeners]) {
      try {
        listener()
      } catch (error) {
        console.error('[aside] anchor listener threw:', error)
      }
    }
  }
}

function defaultStorage(): Storage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage
  } catch {
    return undefined
  }
}
