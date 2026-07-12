import { useLocalStorage } from '@vueuse/core'

/*
 * Tracks whether this browser has opened the desktop before (persisted in
 * localStorage). Used to seed the default window layout only on the very first
 * visit, so returning visitors land on a clean desktop.
 */
export function useFirstRun() {
  const seen = useLocalStorage('xp-visited', false)

  function isFirstRun(): boolean {
    return !seen.value
  }

  function markSeen(): void {
    seen.value = true
  }

  return { isFirstRun, markSeen }
}
