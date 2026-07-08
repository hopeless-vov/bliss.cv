import { useContextMenuStore } from '@/stores/context-menu'
import { clampMenuPosition } from '@/utils/clamp-menu'
import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

/* Desktop right-click menu: open at a clamped position, close on any action. */
export function useContextMenu() {
  const store = useContextMenuStore()
  const { width, height } = useWindowSize()

  const isOpen = computed(() => store.open)
  const position = computed(() => store.position)

  function openAt(x: number, y: number): void {
    store.show(clampMenuPosition(x, y, width.value, height.value))
  }

  function close(): void {
    store.hide()
  }

  return { isOpen, position, openAt, close }
}
