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

  it('boots, then finishes after the boot duration', () => {
    const power = usePower()
    power.boot()
    expect(power.isBooting.value).toBe(true)

    vi.advanceTimersByTime(3400)
    expect(power.isBooting.value).toBe(false)
  })

  it('skips the boot immediately', () => {
    const power = usePower()
    power.boot()
    power.skipBoot()

    expect(power.isBooting.value).toBe(false)
  })

  it('does nothing when skipping after boot finished', () => {
    const power = usePower()
    power.boot()
    vi.advanceTimersByTime(3400)

    power.skipBoot()

    expect(power.isBooting.value).toBe(false)
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

  it('shuts down: closes the start menu and shows the shutdown screen', () => {
    const store = useShellStore()
    const power = usePower()
    power.boot()
    vi.advanceTimersByTime(3400)
    store.setStartMenuOpen(true)

    power.shutDown()

    expect(power.isShutdown.value).toBe(true)
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
