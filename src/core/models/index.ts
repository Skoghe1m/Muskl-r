export type ID = string

export type Set = {
  id: ID
  targetReps?: number
  targetWeightKg?: number
}

export type Exercise = {
  id: ID
  name: string
  sets: Set[]
}

export type Workout = {
  id: ID
  name: string
  exercises: Exercise[]
}

export type SessionStatus = 'idle' | 'running' | 'paused' | 'stopped'

export type SessionProgressSet = {
  setId: ID
  completed: boolean
  actualReps?: number
  actualWeightKg?: number
}

export type SessionProgressExercise = {
  exerciseId: ID
  sets: SessionProgressSet[]
}

export type Session = {
  id: ID
  workoutId: ID
  status: SessionStatus
  startedAt?: number
  endedAt?: number
  elapsedMs: number
  exercises: SessionProgressExercise[]
}

export type HistoryEntry = {
  id: ID
  workoutId: ID
  workoutName: string
  startedAt: number
  endedAt: number
  elapsedMs: number
  status: 'completed' | 'abandoned'
  summary: {
    exercises: Array<{
      exerciseId: ID
      exerciseName: string
      completedSets: number
      totalSets: number
      sets: Array<{ setId: ID; completed: boolean }>
    }>
  }
}
