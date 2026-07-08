import { useEventListener } from '@vueuse/core'

/* Run a handler whenever Escape is pressed (for closing the topmost overlay). */
export function useEscapeKey(handler: () => void): void {
  useEventListener(window, 'keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handler()
    }
  })
}
