import type { Point } from '@/utils/clamp-window'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/* Thin state container for the desktop right-click menu (shared so any component can close it). */
export const useContextMenuStore = defineStore('context-menu', () => {
  const open = ref(false)
  const position = ref<Point>({ x: 0, y: 0 })

  function show(at: Point): void {
    position.value = at
    open.value = true
  }

  function hide(): void {
    open.value = false
  }

  return { open, position, show, hide }
})
