type Value = string | null

export type StorageAdapter = {
  getItem: (key: string) => Value
  setItem: (key: string, value: string) => void
}

function createMemoryStorage(): StorageAdapter {
  const store = new Map<string, string>()
  return {
    getItem: (k) => (store.has(k) ? store.get(k)! : null),
    setItem: (k, v) => { store.set(k, v) }
  }
}

export function createStorage(): StorageAdapter {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    try {
      const testKey = '__musklr_test__'
      window.localStorage.setItem(testKey, '1')
      window.localStorage.removeItem(testKey)
      return {
        getItem: (k) => window.localStorage.getItem(k),
        setItem: (k, v) => window.localStorage.setItem(k, v)
      }
    } catch {
      return createMemoryStorage()
    }
  }
  return createMemoryStorage()
}
