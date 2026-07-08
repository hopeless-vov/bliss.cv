import type { Point } from '@/utils/clamp-window'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

/*
 * Thin state container for icon positions the visitor has dragged, persisted
 * under the XP key. Icons without an entry here fall back to the default grid
 * (see useIconPositions / icon-grid.ts).
 */
export const useIconPositionsStore = defineStore('icon-positions', () => {
  const positions = useLocalStorage<Record<string, Point>>('xp-icon-pos', {})

  function setPosition(id: string, point: Point): void {
    positions.value = { ...positions.value, [id]: point }
  }

  function clear(): void {
    positions.value = {}
  }

  return { positions, setPosition, clear }
})
