import { defineStore } from 'pinia'
import { ref } from 'vue'

/*
 * Thin state container for the desktop shell lifecycle: boot screen, shutdown
 * screen, and the start menu. All behaviour (timers, transitions) lives in
 * usePower / useStartMenu.
 */
export const useShellStore = defineStore('shell', () => {
  const booting = ref(true)
  const shutdown = ref(false)
  const startMenuOpen = ref(false)

  function setBooting(value: boolean): void {
    booting.value = value
  }

  function setShutdown(value: boolean): void {
    shutdown.value = value
  }

  function setStartMenuOpen(value: boolean): void {
    startMenuOpen.value = value
  }

  return {
    booting,
    shutdown,
    startMenuOpen,
    setBooting,
    setShutdown,
    setStartMenuOpen,
  }
})
