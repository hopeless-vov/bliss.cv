import { MOBILE_BREAKPOINT, WINDOW_CASCADE_STEP } from '@/config/constants'
import { useWindowsStore } from '@/stores/windows'
import { centerWindowPosition, clampWindowPosition } from '@/utils/clamp-window'
import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

/*
 * All window behaviour for the single-window desktop. State lives in the
 * windows store; this composable owns the logic: opening (centre vs cascade),
 * minimize/restore, maximize, dragging (clamped), and the mobile rule that
 * forces windows to fill the screen.
 */
export function useWindowManager() {
  const store = useWindowsStore()
  const { width, height } = useWindowSize()

  const isMobile = computed(() => width.value <= MOBILE_BREAKPOINT)
  const openId = computed(() => store.openId)
  const isOpen = computed(() => store.openId !== null)
  const isVisible = computed(() => isOpen.value && !store.minimized)
  const isMaximized = computed(() => store.maximized || isMobile.value)
  const position = computed(() => store.position)

  function open(id: string): void {
    if (store.openId !== id) {
      const next = store.openId
        ? clampWindowPosition(
            store.position.x + WINDOW_CASCADE_STEP,
            store.position.y + WINDOW_CASCADE_STEP,
            width.value,
            height.value,
          )
        : centerWindowPosition(width.value, height.value)
      store.setPosition(next)
    }
    store.setOpen(id)
  }

  function close(): void {
    store.reset()
  }

  function minimize(): void {
    store.setMinimized(true)
  }

  function restore(): void {
    store.setMinimized(false)
  }

  /* Taskbar-button behaviour: minimize when visible, restore when minimized. */
  function toggleMinimized(): void {
    store.setMinimized(!store.minimized)
  }

  function toggleMaximize(): void {
    store.setMaximized(!store.maximized)
  }

  function moveTo(x: number, y: number): void {
    store.setPosition(clampWindowPosition(x, y, width.value, height.value))
  }

  return {
    isMobile,
    openId,
    isOpen,
    isVisible,
    isMaximized,
    position,
    open,
    close,
    minimize,
    restore,
    toggleMinimized,
    toggleMaximize,
    moveTo,
  }
}
