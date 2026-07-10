import type { Point } from '@/utils/clamp-window'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/*
 * State for the multi-window desktop. Each open window is one entry; `z` is a
 * compact 1..n stacking rank (higher paints on top) that is re-normalised on
 * every add / focus / remove — so it never grows unbounded and the rendered
 * z-index stays within the window band, below the taskbar. All behaviour —
 * where a window spawns, focus rules, clamping, the mobile full-screen rule —
 * lives in useWindowManager; this store only holds and mutates raw state.
 */
export interface WindowState {
  id: string
  minimized: boolean
  maximized: boolean
  position: Point
  z: number
}

export const useWindowsStore = defineStore('windows', () => {
  const windows = ref<WindowState[]>([])

  function add(id: string, position: Point): void {
    windows.value.push({
      id,
      minimized: false,
      maximized: false,
      position,
      z: windows.value.length + 1,
    })
  }

  function remove(id: string): void {
    const win = windows.value.find((entry) => entry.id === id)
    if (!win) {
      return
    }
    const removed = win.z
    windows.value = windows.value.filter((entry) => entry.id !== id)
    // Close the gap so the ranks stay a compact 1..n.
    for (const entry of windows.value) {
      if (entry.z > removed) {
        entry.z -= 1
      }
    }
  }

  function patch(id: string, changes: Partial<Omit<WindowState, 'id'>>): void {
    const win = windows.value.find((entry) => entry.id === id)
    if (win) {
      Object.assign(win, changes)
    }
  }

  /* Raise a window to the top of the stack, sliding the ones above it down. */
  function focus(id: string): void {
    const win = windows.value.find((entry) => entry.id === id)
    if (!win) {
      return
    }
    const top = windows.value.length
    if (win.z === top) {
      return
    }
    const from = win.z
    for (const entry of windows.value) {
      if (entry.z > from) {
        entry.z -= 1
      }
    }
    win.z = top
  }

  return { windows, add, remove, patch, focus }
})
