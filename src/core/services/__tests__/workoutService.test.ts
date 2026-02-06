import { describe, it, expect } from 'vitest'
import { getWorkoutService } from '../workoutService'

describe('workoutService', () => {
  it('creates and lists workouts', () => {
    const svc = getWorkoutService()
    const w = svc.create({ name: 'Test', exercises: [] })
    const list = svc.list()
    expect(list.find(x => x.id === w.id)?.name).toBe('Test')
  })
  it('updates workout name', () => {
    const svc = getWorkoutService()
    const w = svc.create({ name: 'A', exercises: [] })
    const u = svc.update(w.id, { name: 'B' })
    expect(u?.name).toBe('B')
  })
  it('removes workout', () => {
    const svc = getWorkoutService()
    const w = svc.create({ name: 'Del', exercises: [] })
    const ok = svc.remove(w.id)
    expect(ok).toBe(true)
  })
})
