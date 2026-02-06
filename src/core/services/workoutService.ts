import { createStorage } from '../../platform/storage'
import { ID, Workout, Exercise, Set } from '../models'

const storage = createStorage()
const KEY = 'core.workouts'

function uid(): ID {
  return Math.random().toString(36).slice(2, 10)
}

function load(): Workout[] {
  const raw = storage.getItem(KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Workout[]
  } catch {
    return []
  }
}

function save(ws: Workout[]) {
  storage.setItem(KEY, JSON.stringify(ws))
}

export function getWorkoutService() {
  let workouts = load()
  const listeners = new Set<() => void>()
  function notify() { listeners.forEach((fn) => fn()) }

  function ensureIds(w: Omit<Workout, 'id'>): Workout {
    if (!w.name || !w.name.trim()) {
      throw new Error('Workout name is required')
    }
    return {
      id: uid(),
      name: w.name,
      exercises: w.exercises.map((e) => ({
        id: uid(),
        name: e.name.trim(),
        sets: e.sets.map((s) => ({
          id: uid(),
          targetReps: s.targetReps,
          targetWeightKg: s.targetWeightKg
        }))
      }))
    }
  }

  return {
    list(): Workout[] {
      return workouts
    },
    subscribe(fn: () => void) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    create(input: Omit<Workout, 'id'>): Workout {
      const w = ensureIds(input)
      workouts = [...workouts, w]
      save(workouts)
      notify()
      return w
    },
    update(id: ID, patch: Partial<Omit<Workout, 'id'>>): Workout | null {
      let updated: Workout | null = null
      workouts = workouts.map((w) => {
        if (w.id !== id) return w
        updated = {
          ...w,
          name: (patch.name ?? w.name).trim(),
          exercises: patch.exercises ?? w.exercises
        }
        return updated
      })
      if (updated) {
        save(workouts)
        notify()
      }
      return updated
    },
    remove(id: ID): boolean {
      const before = workouts.length
      workouts = workouts.filter((w) => w.id !== id)
      if (workouts.length !== before) {
        save(workouts)
        notify()
        return true
      }
      return false
    },
    addExercise(workoutId: ID, exercise: Omit<Exercise, 'id' | 'sets'> & { sets?: Omit<Set, 'id'>[] }): Workout | null {
      const target = workouts.find(w => w.id === workoutId)
      if (!target) return null
      const name = (exercise.name || '').trim()
      const sets = (exercise.sets ?? []).map((s) => ({ id: uid(), ...s }))
      if (!name) throw new Error('Exercise name is required')
      if (sets.length === 0) throw new Error('Exercise must have at least one set')
      const ex: Exercise = { id: uid(), name, sets }
      return this.update(workoutId, {
        exercises: target.exercises.concat(ex)
      })
    }
  }
}
