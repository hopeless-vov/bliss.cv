import { useNotes } from '@/composables/use-notes'
import { useWindowManager } from '@/composables/use-window-manager'
import { DESKTOP_ITEMS } from '@/config/desktop-items'
import { useDesktopStore } from '@/stores/desktop'
import type { DesktopItem } from '@/types/desktop'
import { computed } from 'vue'

/*
 * Desktop-surface behaviour: icon selection and item activation. Activating an
 * item dispatches on its action — open a window, open the PDF in a new tab, or
 * spawn a sticky note. Selection lives in a store so any component (the icon
 * grid, the context menu, …) shares the same selected icon.
 */
export function useDesktop() {
  const store = useDesktopStore()
  const { open } = useWindowManager()
  const { createNote } = useNotes()

  const selectedId = computed(() => store.selectedId)

  function select(id: string): void {
    store.select(id)
  }

  function clearSelection(): void {
    store.clearSelection()
  }

  function activate(item: DesktopItem): void {
    store.select(item.id)
    if (item.action === 'window') {
      open(item.id)
    } else if (item.action === 'pdf' && item.href) {
      window.open(item.href, '_blank', 'noopener')
    } else if (item.action === 'note') {
      createNote()
    }
  }

  function activateById(id: string): void {
    const item = DESKTOP_ITEMS.find((entry) => entry.id === id)
    if (item) {
      activate(item)
    }
  }

  return { selectedId, select, clearSelection, activate, activateById }
}
