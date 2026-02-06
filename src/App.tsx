import { Routes, Route } from 'react-router-dom'
import Home from './ui/pages/Home'
import WorkoutPage from './ui/pages/Workout'
import HistoryPage from './ui/pages/History'
import Settings from './ui/pages/Settings'
import Header from './ui/components/Header'
import { WorkoutProvider } from './ui/context/WorkoutContext'
import { HistoryProvider } from './ui/context/HistoryContext'

export default function App() {
  return (
    <WorkoutProvider>
      <HistoryProvider>
        <div className="app">
          <Header />
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/workout/:id" element={<WorkoutPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </HistoryProvider>
    </WorkoutProvider>
  )
}
