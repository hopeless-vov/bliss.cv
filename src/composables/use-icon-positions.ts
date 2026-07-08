import { DESKTOP_ITEMS } from '@/config/desktop-items'
import { useIconPositionsStore } from '@/stores/icon-positions'
import type { Point } from '@/utils/clamp-window'
import { clampIconPosition } from '@/utils/clamp-window'
import { defaultIconPosition } from '@/utils/icon-grid'
import { useWindowSize } from '@vueuse/core'

/*
 * Desktop icon layout: each icon sits at its dragged position, or falls back
 * to the default grid. "Arrange Icons" simply forgets all dragged positions.
 */
export function useIconPositions() {
  const store = useIconPositionsStore()
  const { width, height } = useWindowSize()

  function positionFor(id: string): Point {
    const stored = store.positions[id]
    if (stored) {
      return stored
    }
    const item = DESKTOP_ITEMS.find((entry) => entry.id === id)
    return item ? defaultIconPosition(item, width.value, height.value) : { x: 0, y: 0 }
  }

  function moveIcon(id: string, x: number, y: number): void {
    store.setPosition(id, clampIconPosition(x, y, width.value, height.value))
  }

  function arrangeIcons(): void {
    store.clear()
  }

  return { positionFor, moveIcon, arrangeIcons }
}
