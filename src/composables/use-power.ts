import { BALLOON_DURATION, BOOT_DURATION } from '@/config/constants'
import { useShellStore } from '@/stores/shell'
import { computed } from 'vue'

/*
 * The desktop power lifecycle: boot screen (3.4s, skippable) → welcome balloon
 * (auto-hides after 9s) → running. "Turn Off Computer" shows the shutdown
 * screen; clicking it boots back up.
 */
export function usePower() {
  const store = useShellStore()

  let bootTimer: ReturnType<typeof setTimeout> | null = null
  let balloonTimer: ReturnType<typeof setTimeout> | null = null

  const isBooting = computed(() => store.booting)
  const isShutdown = computed(() => store.shutdown)
  const isBalloonVisible = computed(() => store.balloonVisible)

  function clearTimers(): void {
    if (bootTimer) {
      clearTimeout(bootTimer)
      bootTimer = null
    }
    if (balloonTimer) {
      clearTimeout(balloonTimer)
      balloonTimer = null
    }
  }

  function finishBoot(): void {
    if (bootTimer) {
      clearTimeout(bootTimer)
      bootTimer = null
    }
    store.setBooting(false)
    store.setBalloonVisible(true)
    balloonTimer = setTimeout(() => store.setBalloonVisible(false), BALLOON_DURATION)
  }

  function boot(): void {
    clearTimers()
    store.setShutdown(false)
    store.setBalloonVisible(false)
    store.setBooting(true)
    bootTimer = setTimeout(finishBoot, BOOT_DURATION)
  }

  function skipBoot(): void {
    if (store.booting) {
      finishBoot()
    }
  }

  function dismissBalloon(): void {
    if (balloonTimer) {
      clearTimeout(balloonTimer)
      balloonTimer = null
    }
    store.setBalloonVisible(false)
  }

  function shutDown(): void {
    clearTimers()
    store.setBalloonVisible(false)
    store.setStartMenuOpen(false)
    store.setShutdown(true)
  }

  return { isBooting, isShutdown, isBalloonVisible, boot, skipBoot, dismissBalloon, shutDown }
}
