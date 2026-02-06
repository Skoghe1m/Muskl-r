import { createStorage } from '../../platform/storage'
import type { HistoryEntry } from '../models'

const storage = createStorage()
const KEY = 'core.history'

function load(): HistoryEntry[] {
  const raw = storage.getItem(KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as HistoryEntry[]
  } catch {
    return []
  }
}
function save(h: HistoryEntry[]) {
  storage.setItem(KEY, JSON.stringify(h))
}

export function getHistoryService() {
  let history = load()
  return {
    list(): HistoryEntry[] {
      return history.slice().sort((a, b) => b.startedAt - a.startedAt)
    },
    add(entry: HistoryEntry) {
      history = [entry, ...history]
      save(history)
    },
    clear() {
      history = []
      save(history)
    }
  }
}
