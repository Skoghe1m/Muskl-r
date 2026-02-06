import React, { createContext, useContext, useMemo, useSyncExternalStore } from 'react'
import { getHistoryService } from '../../core/services/historyService'
import { HistoryEntry } from '../../core/models'

const historySvc = getHistoryService()

type Value = {
  history: HistoryEntry[]
  clear: () => void
}

const Ctx = createContext<Value | null>(null)

function useHistoryExternal() {
  return useSyncExternalStore(
    (cb) => { return () => {} },
    () => historySvc.list()
  )
}

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const history = useHistoryExternal()
  const value = useMemo<Value>(() => ({
    history,
    clear: () => historySvc.clear()
  }), [history])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useHistory() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('HistoryContext not found')
  return ctx
}
