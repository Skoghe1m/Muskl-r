import { describe, it, expect } from 'vitest'
import { getSessionService } from '../sessionService'
import { Workout } from '../../models'

const workout: Workout = {
  id: 'w1',
  name: 'Test',
  exercises: [
    { id: 'e1', name: 'Squat', sets: [{ id: 's1' }, { id: 's2' }] },
    { id: 'e2', name: 'Bench', sets: [{ id: 's3' }] }
  ]
}

describe('sessionService', () => {
  it('timer accumulates by timestamps', async () => {
    const svc = getSessionService()
    svc.start(workout)
    await new Promise((r) => setTimeout(r, 600))
    const s = svc.get()!
    expect(s.elapsedMs).toBeGreaterThanOrEqual(500)
    svc.stop()
  })
})
