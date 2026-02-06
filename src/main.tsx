import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './ui/styles.css'
import { getSettingsService } from './core/settings/service'
import { applyTheme } from './platform/theme'

const container = document.getElementById('root')!
const root = createRoot(container)
// apply saved theme before first paint
try {
  const theme = getSettingsService().getTheme()
  applyTheme(theme)
} catch {}
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)

