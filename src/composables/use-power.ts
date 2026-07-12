import { BOOT_DURATION } from '@/config/constants'
import { useShellStore } from '@/stores/shell'
import { computed } from 'vue'

/*
 * The desktop power lifecycle: boot screen (3.4s, skippable) → running.
 * "Turn Off Computer" shows the shutdown screen; clicking it boots back up.
 */
export function usePower() {
  const store = useShellStore()

  let bootTimer: ReturnType<typeof setTimeout> | null = null

  const isBooting = computed(() => store.booting)
  const isShutdown = computed(() => store.shutdown)

  function clearBootTimer(): void {
    if (bootTimer) {
      clearTimeout(bootTimer)
      bootTimer = null
    }
  }

  function finishBoot(): void {
    clearBootTimer()
    store.setBooting(false)
  }

  function boot(): void {
    clearBootTimer()
    store.setShutdown(false)
    store.setBooting(true)
    bootTimer = setTimeout(finishBoot, BOOT_DURATION)
  }

  function skipBoot(): void {
    if (store.booting) {
      finishBoot()
    }
  }

  function shutDown(): void {
    clearBootTimer()
    store.setStartMenuOpen(false)
    store.setShutdown(true)
  }

  return { isBooting, isShutdown, boot, skipBoot, shutDown }
}
