import type { Point } from '@/utils/clamp-window'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/*
 * Thin state container for the desktop's single-window model. All behaviour
 * (opening, cascading, clamping, mobile rules) lives in useWindowManager — this
 * store only holds the raw state.
 */
export const useWindowsStore = defineStore('windows', () => {
  const openId = ref<string | null>(null)
  const minimized = ref(false)
  const maximized = ref(false)
  const position = ref<Point>({ x: 0, y: 0 })

  function setOpen(id: string): void {
    openId.value = id
    minimized.value = false
  }

  function setMinimized(value: boolean): void {
    minimized.value = value
  }

  function setMaximized(value: boolean): void {
    maximized.value = value
  }

  function setPosition(next: Point): void {
    position.value = next
  }

  function reset(): void {
    openId.value = null
    minimized.value = false
    maximized.value = false
  }

  return {
    openId,
    minimized,
    maximized,
    position,
    setOpen,
    setMinimized,
    setMaximized,
    setPosition,
    reset,
  }
})
