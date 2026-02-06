import React, { createContext, useContext, useMemo, useSyncExternalStore, useState } from 'react'
import { getWorkoutService } from '../../core/services/workoutService'
import { getSessionService } from '../../core/services/sessionService'
import { Workout, Session } from '../../core/models'

const workoutSvc = getWorkoutService()
const sessionSvc = getSessionService()

type Value = {
  workouts: Workout[]
  session: Session | null
  createWorkout: (name: string) => Workout
  addExercise: (workoutId: string, name: string, sets: number) => void
  startWorkout: (w: Workout) => void
  pauseWorkout: () => void
  resumeWorkout: () => void
  stopWorkout: () => void
  toggleSet: (exerciseId: string, setId: string) => void
  removeWorkout: (id: string) => void
  abandonSession: () => void
}

const Ctx = createContext<Value | null>(null)

function useWorkoutsExternal() {
  return useSyncExternalStore(
    (cb) => workoutSvc.subscribe(cb),
    () => workoutSvc.list()
  )
}

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const workouts = useWorkoutsExternal()
  const [session, setSession] = useState<Session | null>(sessionSvc.get())

  React.useEffect(() => {
    const unsub = sessionSvc.subscribe((s) => setSession({ ...s }))
    // attempt restore on mount
    sessionSvc.restore()
    return () => unsub()
  }, [])

  const value = useMemo<Value>(() => ({
    workouts,
    session,
    createWorkout: (name: string) => {
      return workoutSvc.create({
        name,
        exercises: []
      })
    },
    addExercise: (workoutId: string, name: string, sets: number) => {
      const s = Array.from({ length: Math.max(0, sets) }, () => ({}))
      workoutSvc.addExercise(workoutId, { name, sets: s })
    },
    startWorkout: (w: Workout) => { sessionSvc.start(w) },
    pauseWorkout: () => { sessionSvc.pause() },
    resumeWorkout: () => { sessionSvc.resume() },
    stopWorkout: () => { sessionSvc.stop() },
    toggleSet: (exId, setId) => { sessionSvc.toggleSet(exId, setId) },
    removeWorkout: (id: string) => { workoutSvc.remove(id) },
    abandonSession: () => { sessionSvc.abandon() }
  }), [workouts, session])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useWorkout() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('WorkoutContext not found')
  return ctx
}
