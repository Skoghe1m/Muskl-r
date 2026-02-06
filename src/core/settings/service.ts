import { createStorage } from '../../platform/storage'

type Theme = 'light' | 'dark'

const storage = createStorage()
const THEME_KEY = 'settings.theme'

export function getSettingsService() {
  return {
    getTheme(): Theme {
      const v = storage.getItem(THEME_KEY)
      return v === 'dark' ? 'dark' : 'light'
    },
    setTheme(v: Theme) {
      storage.setItem(THEME_KEY, v)
    }
  }
}
