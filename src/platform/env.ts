export const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined'

export function now(): number {
  return typeof Date !== 'undefined' ? Date.now() : 0
}
