import { useShellStore } from '@/stores/shell'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

describe('shell store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts booting with everything else off', () => {
    const store = useShellStore()

    expect(store.booting).toBe(true)
    expect(store.balloonVisible).toBe(false)
    expect(store.shutdown).toBe(false)
    expect(store.startMenuOpen).toBe(false)
  })

  it('sets each flag', () => {
    const store = useShellStore()

    store.setBooting(false)
    store.setBalloonVisible(true)
    store.setShutdown(true)
    store.setStartMenuOpen(true)

    expect(store.booting).toBe(false)
    expect(store.balloonVisible).toBe(true)
    expect(store.shutdown).toBe(true)
    expect(store.startMenuOpen).toBe(true)
  })
})
