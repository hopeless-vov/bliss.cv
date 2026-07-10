import { MOBILE_BREAKPOINT, WINDOW_CASCADE_STEP } from '@/config/constants'
import type { WindowState } from '@/stores/windows'
import { useWindowsStore } from '@/stores/windows'
import type { Point } from '@/utils/clamp-window'
import { centerWindowPosition, clampWindowPosition } from '@/utils/clamp-window'
import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

/*
 * Behaviour for the multi-window desktop. Windows open side by side, each with
 * its own position, minimize/maximize state and stacking order. Opening a file
 * that's already open focuses it instead of spawning a duplicate; clicking a
 * window (or its taskbar button) raises it to the top — the full Windows model.
 * State lives in the windows store; the logic — spawn position, focus rules,
 * clamping, the mobile full-screen rule — lives here.
 */
export function useWindowManager() {
  const store = useWindowsStore()
  const { width, height } = useWindowSize()

  const isMobile = computed(() => width.value <= MOBILE_BREAKPOINT)
  const windows = computed(() => store.windows)

  // The focused window is the top-most (highest z) window that isn't minimized.
  const focused = computed<WindowState | null>(() => {
    let top: WindowState | null = null
    for (const win of store.windows) {
      if (win.minimized) continue
      if (!top || win.z > top.z) top = win
    }
    return top
  })
  const focusedId = computed(() => focused.value?.id ?? null)

  function find(id: string): WindowState | undefined {
    return store.windows.find((win) => win.id === id)
  }

  function isOpen(id: string): boolean {
    return find(id) !== undefined
  }

  function isVisible(id: string): boolean {
    const win = find(id)
    return Boolean(win && !win.minimized)
  }

  function isMaximized(id: string): boolean {
    return Boolean(find(id)?.maximized) || isMobile.value
  }

  /* First window centres; each subsequent one cascades off the focused one. */
  function spawnPosition(): Point {
    const top = focused.value
    if (!top) {
      return centerWindowPosition(width.value, height.value)
    }
    return clampWindowPosition(
      top.position.x + WINDOW_CASCADE_STEP,
      top.position.y + WINDOW_CASCADE_STEP,
      width.value,
      height.value,
    )
  }

  function open(id: string): void {
    const existing = find(id)
    if (existing) {
      if (existing.minimized) {
        store.patch(id, { minimized: false })
      }
      store.focus(id)
      return
    }
    store.add(id, spawnPosition())
  }

  function close(id: string): void {
    store.remove(id)
  }

  function closeFocused(): void {
    if (focusedId.value) {
      close(focusedId.value)
    }
  }

  /* Raise a window to the top without changing its minimized state. */
  function focus(id: string): void {
    store.focus(id)
  }

  function minimize(id: string): void {
    store.patch(id, { minimized: true })
  }

  function restore(id: string): void {
    store.patch(id, { minimized: false })
    store.focus(id)
  }

  /*
   * Taskbar-button behaviour, matching XP: a minimized window restores and
   * comes forward; the focused window minimizes; any other open window just
   * comes forward.
   */
  function toggleMinimized(id: string): void {
    const win = find(id)
    if (!win) {
      return
    }
    if (win.minimized) {
      restore(id)
    } else if (id === focusedId.value) {
      minimize(id)
    } else {
      store.focus(id)
    }
  }

  function toggleMaximize(id: string): void {
    const win = find(id)
    if (win) {
      store.patch(id, { maximized: !win.maximized })
    }
  }

  function moveTo(id: string, x: number, y: number): void {
    store.patch(id, { position: clampWindowPosition(x, y, width.value, height.value) })
  }

  return {
    isMobile,
    windows,
    focusedId,
    isOpen,
    isVisible,
    isMaximized,
    open,
    close,
    closeFocused,
    focus,
    minimize,
    restore,
    toggleMinimized,
    toggleMaximize,
    moveTo,
  }
}
