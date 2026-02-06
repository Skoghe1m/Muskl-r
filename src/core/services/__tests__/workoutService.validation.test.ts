import { describe, it, expect } from 'vitest'
import { getWorkoutService } from '../workoutService'

describe('workoutService validation', () => {
  it('rejects empty workout name', () => {
    const svc = getWorkoutService()
    expect(() => svc.create({ name: '  ', exercises: [] })).toThrow()
  })
  it('rejects exercise without name', () => {
    const svc = getWorkoutService()
    const w = svc.create({ name: 'W', exercises: [] })
    expect(() => svc.addExercise(w.id, { name: ' ', sets: [{}] })).toThrow()
  })
  it('rejects exercise with zero sets', () => {
    const svc = getWorkoutService()
    const w = svc.create({ name: 'W', exercises: [] })
    expect(() => svc.addExercise(w.id, { name: 'E', sets: [] })).toThrow()
  })
})
