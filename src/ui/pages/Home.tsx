import { Link, useNavigate } from 'react-router-dom'
import { useWorkout } from '../context/WorkoutContext'
import { useState } from 'react'

export default function Home() {
  const { workouts, createWorkout, removeWorkout, session, abandonSession } = useWorkout()
  const nav = useNavigate()
  const [error, setError] = useState<string | null>(null)
  return (
    <section className="page">
      <h1 className="title">Musklr</h1>
      <p className="subtitle">Create and run simple workouts</p>
      {session && (
        <div className="card">
          <div className="row">
            <span>Restored session available</span>
            <div className="actions">
              <button onClick={() => nav(`/workout/${session.workoutId}`)}>Resume</button>
              <button onClick={() => nav(`/workout/${session.workoutId}`)}>Open</button>
              <button onClick={() => abandonSession()}>Abandon</button>
            </div>
          </div>
        </div>
      )}
      <form className="row" onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget as HTMLFormElement)
        const name = String(fd.get('name') || '').trim()
        if (!name) { setError('Workout name is required'); return }
        try {
          const w = createWorkout(name)
          setError(null)
          (e.currentTarget as HTMLFormElement).reset()
          nav(`/workout/${w.id}`)
        } catch (err) {
          setError('Could not create workout')
        }
      }}>
        <input name="name" placeholder="New workout name" aria-label="Workout name" />
        <button className="button" type="submit">Add</button>
      </form>
      {error && <p className="subtitle" role="alert">{error}</p>}
      <div className="list">
        {workouts.length === 0 && <p className="subtitle">No workouts yet</p>}
        {workouts.map((w) => (
          <div key={w.id} className="row">
            <Link to={`/workout/${w.id}`}>{w.name}</Link>
            <button onClick={() => removeWorkout(w.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="actions">
        <Link className="button" to="/history">History</Link>
        <Link className="button" to="/settings">Settings</Link>
      </div>
    </section>
  )
}
