/**
 * Vitest runs jsdom workers inside Node, whose experimental global
 * `localStorage` can be enabled without a backing file by the host process.
 * Install a deterministic browser-local implementation so client tests never
 * touch that process-global storage.
 */
if (typeof window !== 'undefined') {
  const records = new Map<string, string>()
  const storage: Storage = {
    get length() {
      return records.size
    },
    clear() {
      records.clear()
    },
    getItem(key) {
      return records.get(key) ?? null
    },
    key(index) {
      return [...records.keys()][index] ?? null
    },
    removeItem(key) {
      records.delete(key)
    },
    setItem(key, value) {
      records.set(key, value)
    },
  }

  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: storage,
  })
}
