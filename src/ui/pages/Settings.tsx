import { useEffect, useState } from 'react'
import { getSettingsService } from '../../core/settings/service'
import { applyTheme } from '../../platform/theme'

export default function Settings() {
  const svc = getSettingsService()
  const [theme, setTheme] = useState<'light' | 'dark'>(svc.getTheme())

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <section className="page">
      <h2 className="title">Settings</h2>
      <div className="list">
        <label className="row">
          <span>Theme</span>
          <select
            aria-label="Theme"
            value={theme}
            onChange={(e) => {
              const next = e.target.value === 'dark' ? 'dark' : 'light'
              setTheme(next)
              svc.setTheme(next)
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
    </section>
  )
}
