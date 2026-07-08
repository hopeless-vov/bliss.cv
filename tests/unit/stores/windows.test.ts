import { useWindowsStore } from '@/stores/windows'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

describe('windows store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('opens a window and clears the minimized flag', () => {
    const store = useWindowsStore()
    store.setMinimized(true)
    store.setOpen('about')

    expect(store.openId).toBe('about')
    expect(store.minimized).toBe(false)
  })

  it('sets minimized, maximized and position', () => {
    const store = useWindowsStore()

    store.setMinimized(true)
    store.setMaximized(true)
    store.setPosition({ x: 5, y: 6 })

    expect(store.minimized).toBe(true)
    expect(store.maximized).toBe(true)
    expect(store.position).toEqual({ x: 5, y: 6 })
  })

  it('resets to the closed state', () => {
    const store = useWindowsStore()
    store.setOpen('about')
    store.setMaximized(true)
    store.setMinimized(true)

    store.reset()

    expect(store.openId).toBe(null)
    expect(store.minimized).toBe(false)
    expect(store.maximized).toBe(false)
  })
})
