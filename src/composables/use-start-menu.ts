import { useShellStore } from '@/stores/shell'
import { computed } from 'vue'

/* Start menu visibility — toggled from the taskbar, closed by desktop clicks. */
export function useStartMenu() {
  const store = useShellStore()

  const isOpen = computed(() => store.startMenuOpen)

  function toggle(): void {
    store.setStartMenuOpen(!store.startMenuOpen)
  }

  function close(): void {
    store.setStartMenuOpen(false)
  }

  return { isOpen, toggle, close }
}
