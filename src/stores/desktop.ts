import { defineStore } from 'pinia'
import { ref } from 'vue'

/* Thin state container for desktop-surface state: which icon is selected. */
export const useDesktopStore = defineStore('desktop', () => {
  const selectedId = ref<string | null>(null)

  function select(id: string): void {
    selectedId.value = id
  }

  function clearSelection(): void {
    selectedId.value = null
  }

  return { selectedId, select, clearSelection }
})
