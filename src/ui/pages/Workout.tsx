import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useWorkout } from '../context/WorkoutContext'

export default function WorkoutPage() {
  const { id } = useParams()
  const { workouts, session, startWorkout, pauseWorkout, resumeWorkout, stopWorkout, toggleSet, addExercise } = useWorkout()
  const workout = useMemo(() => workouts.find(w => w.id === id), [workouts, id])
  const [error, setError] = useState<string | null>(null)

  if (!workout) {
    return <section className="page"><h2 className="title">Workout not found</h2></section>
  }

  const runningForThisWorkout = session && session.workoutId === workout.id

  return (
    <section className="page">
      <h2 className="title">{workout.name}</h2>

      {!runningForThisWorkout && (
        <form className="row" onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget as HTMLFormElement)
          const name = String(fd.get('name') || '').trim()
          const sets = Number(fd.get('sets') || 3)
          if (!name) { setError('Exercise name is required'); return }
          if (!Number.isInteger(sets) || sets < 1) { setError('Sets must be a positive integer'); return }
          try {
            addExercise(workout.id, name, sets)
            setError(null)
          } catch {
            setError('Could not add exercise')
          }
          ;(e.currentTarget as HTMLFormElement).reset()
        }}>
          <input name="name" placeholder="Exercise name" aria-label="Exercise name" />
          <input name="sets" type="number" min={1} max={10} placeholder="Sets" aria-label="Sets" defaultValue={3} />
          <button className="button" type="submit">Add Exercise</button>
        </form>
      )}
      {error && <p className="subtitle" role="alert">{error}</p>}

      {!runningForThisWorkout && (
        <div className="actions">
          <button className="button" onClick={() => startWorkout(workout)}>Start</button>
        </div>
      )}

      {runningForThisWorkout && (
        <>
          <p className="subtitle">Elapsed: {formatMs(session!.elapsedMs)}</p>
          <div className="actions">
            {session!.status === 'running' ? (
              <button className="button" onClick={() => pauseWorkout()}>Pause</button>
            ) : (
              <button className="button" onClick={() => resumeWorkout()}>Resume</button>
            )}
            <button className="button" onClick={() => stopWorkout()}>Stop</button>
          </div>
          <div className="list">
            {workout.exercises.map((e) => {
              const prog = session!.exercises.find(x => x.exerciseId === e.id)
              return (
                <div key={e.id} className="card">
                  <div className="row">
                    <strong>{e.name}</strong>
                  </div>
                  <div className="list">
                    {e.sets.map((s) => {
                      const ps = prog?.sets.find(x => x.setId === s.id)
                      const checked = !!ps?.completed
                      return (
                        <label key={s.id} className="row">
                          <span>Set</span>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSet(e.id, s.id)}
                          />
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}
