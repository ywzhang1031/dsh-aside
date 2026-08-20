/** Aside navigation-visibility tests over the public Workspace archive face. */

import { describe, expect, it, vi } from 'vitest'
import type { AsideRecord } from 'dsh-aside-host/types'
import { AsideVisibility } from '../src/client/visibility.ts'

const RECORD: AsideRecord = {
  schemaVersion: 1,
  parentSessionId: 'parent',
  subSessionId: 'aside-1',
  anchor: { messageId: 'm1', exact: 'x', prefix: '', suffix: '', occurrence: 1, startOffset: 0 },
  createdAt: 1,
  updatedAt: 1,
}

describe('AsideVisibility', () => {
  it('archives a confirmed aside and skips an already hidden record', async () => {
    let archived: string[] = []
    const archiveSession = vi.fn(async (id: string) => { archived = [...archived, id] })
    const visibility = new AsideVisibility({
      list: { getSnapshot: () => ({ archivedSessionIds: archived as never[] }) },
      archiveSession: archiveSession as never,
    })

    expect(await visibility.hide(RECORD)).toBe(true)
    expect(await visibility.hide(RECORD)).toBe(true)
    expect(archiveSession).toHaveBeenCalledTimes(1)
    expect(archiveSession).toHaveBeenCalledWith('aside-1')
  })

  it('coalesces concurrent hides and retries a later failure', async () => {
    let release!: () => void
    let attempt = 0
    const archiveSession = vi.fn(() => {
      attempt += 1
      if (attempt === 1) return new Promise<void>(resolve => { release = resolve })
      if (attempt === 2) return Promise.reject(new Error('offline'))
      return Promise.resolve()
    })
    const report = vi.fn()
    const visibility = new AsideVisibility({
      list: { getSnapshot: () => ({ archivedSessionIds: [] }) },
      archiveSession: archiveSession as never,
    }, report)

    const first = visibility.hide(RECORD)
    const same = visibility.hide(RECORD)
    release()
    expect(await first).toBe(true)
    expect(await same).toBe(true)
    expect(archiveSession).toHaveBeenCalledTimes(1)

    expect(await visibility.hide(RECORD)).toBe(false)
    expect(await visibility.hide(RECORD)).toBe(true)
    expect(report).toHaveBeenCalledTimes(1)
    expect(archiveSession).toHaveBeenCalledTimes(3)
  })
})
