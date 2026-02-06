export type Theme = 'light' | 'dark'

export function applyTheme(theme: Theme) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.dataset.theme = theme
  }
}
