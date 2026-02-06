import { useHistory } from '../context/HistoryContext'
import { Link } from 'react-router-dom'

export default function HistoryPage() {
  const { history, clear } = useHistory()
  return (
    <section className="page">
      <h2 className="title">History</h2>
      <div className="actions">
        <button onClick={clear}>Clear</button>
      </div>
      <div className="list">
        {history.length === 0 && <p className="subtitle">No sessions yet</p>}
        {history.map((h) => (
          <div key={h.id} className="card">
            <div className="row">
              <div>
                <div><strong>{h.workoutName || 'Workout'}</strong> • {h.status}</div>
                <div className="subtitle">{new Date(h.startedAt).toLocaleString()} • {formatMs(h.elapsedMs)}</div>
              </div>
              <Link className="button" to={`/workout/${h.workoutId}`}>Open</Link>
            </div>
            <div className="list">
              {h.summary.exercises.map((e) => (
                <div key={e.exerciseId} className="card">
                  <div className="row">
                    <span>{e.exerciseName || 'Exercise'}</span>
                    <span>{e.completedSets}/{e.totalSets} sets</span>
                  </div>
                  <div className="actions">
                    {e.sets.map((s, idx) => (
                      <span key={s.setId} className="subtitle">
                        {s.completed ? '✓' : '○'} Set {idx + 1}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}
