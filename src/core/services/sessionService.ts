import type { ID, Session, SessionStatus, Workout, HistoryEntry } from '../models'
import { createStorage } from '../../platform/storage'
import { getHistoryService } from './historyService'

type Listener = (s: Session) => void

function uid(): ID {
  return Math.random().toString(36).slice(2, 10)
}

export function createSessionFromWorkout(workout: Workout): Session {
  return {
    id: uid(),
    workoutId: workout.id,
    status: 'idle',
    elapsedMs: 0,
    exercises: workout.exercises.map((e) => ({
      exerciseId: e.id,
      sets: e.sets.map((s) => ({
        setId: s.id,
        completed: false
      }))
    }))
  }
}

const storage = createStorage()
const SESSION_KEY = 'core.session'

function persistSession(s: Session | null, lastTick?: number) {
  if (!s) {
    storage.setItem(SESSION_KEY, JSON.stringify(null))
    return
  }
  const payload = { session: s, lastTick }
  storage.setItem(SESSION_KEY, JSON.stringify(payload))
}

export function getSessionService() {
  const historySvc = getHistoryService()
  let session: Session | null = null
  let timer: number | null = null
  let lastTick = 0
  let workoutSnapshot: { workoutName: string; exerciseNames: Record<ID, string> } | null = null
  const listeners = new Set<Listener>()

  function notify() {
    if (session) listeners.forEach((fn) => fn(session!))
    persistSession(session, lastTick)
  }

  function startTimer() {
    stopTimer()
    lastTick = Date.now()
    timer = setInterval(() => {
      if (!session || session.status !== 'running') return
      const now = Date.now()
      session.elapsedMs += now - lastTick
      lastTick = now
      notify()
    }, 500)
  }
  function stopTimer() {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }

  function status(next: SessionStatus) {
    if (!session) return
    session.status = next
    notify()
  }

  return {
    get(): Session | null {
      return session
    },
    subscribe(fn: Listener) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    restore() {
      const raw = storage.getItem(SESSION_KEY)
      if (!raw) return null
      try {
        const parsed = JSON.parse(raw) as { session: Session | null; lastTick?: number } | null
        if (!parsed || !parsed.session) return null
        session = parsed.session
        lastTick = parsed.lastTick ?? Date.now()
        if (session.status === 'running') {
          const now = Date.now()
          session.elapsedMs += Math.max(0, now - lastTick)
          session.status = 'paused'
        }
        notify()
        return session
      } catch {
        return null
      }
    },
    start(workout: Workout): Session {
      if (session) return session
      session = createSessionFromWorkout(workout)
      session.status = 'running'
      session.startedAt = Date.now()
      workoutSnapshot = {
        workoutName: workout.name,
        exerciseNames: Object.fromEntries(workout.exercises.map((e) => [e.id, e.name]))
      }
      startTimer()
      notify()
      return session
    },
    pause() {
      if (!session || session.status !== 'running') return
      status('paused')
      stopTimer()
    },
    resume() {
      if (!session) return
      if (session.status !== 'paused') return
      status('running')
      startTimer()
    },
    stop() {
      if (!session) return
      stopTimer()
      const completedAll = session.exercises.every((e) => e.sets.every((s) => s.completed))
      session.status = 'stopped'
      session.endedAt = Date.now()
      notify()

      const entry: HistoryEntry = {
        id: session.id,
        workoutId: session.workoutId,
        workoutName: workoutSnapshot?.workoutName || '',
        startedAt: session.startedAt!,
        endedAt: session.endedAt!,
        elapsedMs: session.elapsedMs,
        status: completedAll ? 'completed' : 'abandoned',
        summary: {
          exercises: session.exercises.map((e) => ({
            exerciseId: e.exerciseId,
            exerciseName: workoutSnapshot?.exerciseNames[e.exerciseId] || '',
            completedSets: e.sets.filter((s) => s.completed).length,
            totalSets: e.sets.length,
            sets: e.sets.map((s) => ({ setId: s.setId, completed: s.completed }))
          }))
        }
      }
      historySvc.add(entry)
      session = null
      workoutSnapshot = null
      persistSession(null)
    },
    abandon() {
      if (!session) return
      stopTimer()
      session = null
      persistSession(null)
      notify()
    },
    toggleSet(exerciseId: ID, setId: ID) {
      if (!session) return
      const ex = session.exercises.find((e) => e.exerciseId === exerciseId)
      if (!ex) return
      const s = ex.sets.find((x) => x.setId === setId)
      if (!s) return
      s.completed = !s.completed
      notify()
    }
  }
}
