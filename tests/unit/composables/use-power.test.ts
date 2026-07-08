import { usePower } from '@/composables/use-power'
import { useShellStore } from '@/stores/shell'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('usePower', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('boots, shows the balloon, then auto-hides it', () => {
    const power = usePower()
    power.boot()
    expect(power.isBooting.value).toBe(true)

    vi.advanceTimersByTime(3400)
    expect(power.isBooting.value).toBe(false)
    expect(power.isBalloonVisible.value).toBe(true)

    vi.advanceTimersByTime(9000)
    expect(power.isBalloonVisible.value).toBe(false)
  })

  it('skips the boot immediately', () => {
    const power = usePower()
    power.boot()
    power.skipBoot()

    expect(power.isBooting.value).toBe(false)
    expect(power.isBalloonVisible.value).toBe(true)
  })

  it('finishes even when skipped before boot() started a timer', () => {
    const power = usePower()
    power.skipBoot()

    expect(power.isBooting.value).toBe(false)
    expect(power.isBalloonVisible.value).toBe(true)
  })

  it('does nothing when skipping after boot finished', () => {
    const power = usePower()
    power.boot()
    vi.advanceTimersByTime(3400)
    power.dismissBalloon()

    power.skipBoot()

    expect(power.isBooting.value).toBe(false)
    expect(power.isBalloonVisible.value).toBe(false)
  })

  it('dismisses the balloon and cancels its timer', () => {
    const power = usePower()
    power.boot()
    vi.advanceTimersByTime(3400)

    power.dismissBalloon()
    expect(power.isBalloonVisible.value).toBe(false)

    vi.advanceTimersByTime(9000)
    expect(power.isBalloonVisible.value).toBe(false)
  })

  it('dismissing without a pending timer is a no-op', () => {
    const power = usePower()
    power.dismissBalloon()
    expect(power.isBalloonVisible.value).toBe(false)
  })

  it('restarting boot clears the previous timer', () => {
    const power = usePower()
    power.boot()
    vi.advanceTimersByTime(2000)
    power.boot()

    vi.advanceTimersByTime(1400)
    expect(power.isBooting.value).toBe(true)

    vi.advanceTimersByTime(2000)
    expect(power.isBooting.value).toBe(false)
  })

  it('shuts down: hides balloon, closes the start menu, shows shutdown', () => {
    const store = useShellStore()
    const power = usePower()
    power.boot()
    vi.advanceTimersByTime(3400)
    store.setStartMenuOpen(true)

    power.shutDown()

    expect(power.isShutdown.value).toBe(true)
    expect(power.isBalloonVisible.value).toBe(false)
    expect(store.startMenuOpen).toBe(false)
  })

  it('boots back up from shutdown', () => {
    const power = usePower()
    power.shutDown()

    power.boot()

    expect(power.isShutdown.value).toBe(false)
    expect(power.isBooting.value).toBe(true)
  })
})
