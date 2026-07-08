import { focusableWithin, nextFocusIndex } from '@/utils/focusable'
import { useEventListener } from '@vueuse/core'
import type { Ref } from 'vue'

/*
 * Keep Tab focus inside a container while `active()` is true (dialog/menu
 * behaviour). The index maths lives in a pure util; this only wires the key.
 */
export function useFocusTrap(container: Ref<HTMLElement | null>, active: () => boolean): void {
  useEventListener(window, 'keydown', (event: KeyboardEvent) => {
    if (event.key !== 'Tab' || !active() || !container.value) {
      return
    }

    const items = focusableWithin(container.value)
    if (items.length === 0) {
      return
    }

    const current = items.indexOf(document.activeElement as HTMLElement)
    event.preventDefault()
    items[nextFocusIndex(current, items.length, event.shiftKey)]?.focus()
  })
}
