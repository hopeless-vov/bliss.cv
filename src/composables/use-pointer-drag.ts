import type { Point } from '@/utils/clamp-window'
import { useEventListener } from '@vueuse/core'
import { readonly, ref } from 'vue'

/*
 * Shared pointer-drag behaviour for windows, notes, and icons. `start` captures
 * the pointer offset from the dragged thing's origin; every pointermove calls
 * `onMove` with the new origin, and pointerup ends the drag (with an optional
 * `onEnd`, e.g. to persist the final position). The context value passed to
 * `start` identifies WHAT is being dragged.
 */
export function usePointerDrag<T = void>(
  onMove: (x: number, y: number, ctx: T) => void,
  onEnd?: (ctx: T) => void,
) {
  const isDragging = ref(false)
  let state: { dx: number; dy: number; ctx: T } | null = null

  function start(event: PointerEvent, origin: Point, ctx?: T): void {
    state = { dx: event.clientX - origin.x, dy: event.clientY - origin.y, ctx: ctx as T }
    isDragging.value = true
  }

  useEventListener(window, 'pointermove', (event: PointerEvent) => {
    if (!state) {
      return
    }
    onMove(event.clientX - state.dx, event.clientY - state.dy, state.ctx)
  })

  useEventListener(window, 'pointerup', () => {
    if (!state) {
      return
    }
    const { ctx } = state
    state = null
    isDragging.value = false
    onEnd?.(ctx)
  })

  return { isDragging: readonly(isDragging), start }
}
