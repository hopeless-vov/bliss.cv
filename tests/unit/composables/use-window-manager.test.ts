import { useWindowManager } from '@/composables/use-window-manager'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

function setViewport(w: number, h: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: w })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: h })
  window.dispatchEvent(new Event('resize'))
}

describe('useWindowManager', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setViewport(1200, 800)
  })

  it('opens a window centred and visible', () => {
    const wm = useWindowManager()
    wm.open('about')

    expect(wm.openId.value).toBe('about')
    expect(wm.isOpen.value).toBe(true)
    expect(wm.isVisible.value).toBe(true)
    expect(wm.position.value).toEqual({ x: (1200 - 740) / 2, y: (800 - 32 - 540) / 2 })
  })

  it('cascades position when switching to another window', () => {
    const wm = useWindowManager()
    wm.open('about')
    const first = { ...wm.position.value }

    wm.open('skills')

    expect(wm.openId.value).toBe('skills')
    expect(wm.position.value).toEqual({ x: first.x + 18, y: first.y + 18 })
  })

  it('keeps position and restores when re-opening the same window', () => {
    const wm = useWindowManager()
    wm.open('about')
    const pos = { ...wm.position.value }
    wm.minimize()
    expect(wm.isVisible.value).toBe(false)

    wm.open('about')

    expect(wm.isVisible.value).toBe(true)
    expect(wm.position.value).toEqual(pos)
  })

  it('toggleMinimized flips between minimized and restored', () => {
    const wm = useWindowManager()
    wm.open('about')

    wm.toggleMinimized()
    expect(wm.isVisible.value).toBe(false)

    wm.toggleMinimized()
    expect(wm.isVisible.value).toBe(true)
  })

  it('minimizes, restores and closes', () => {
    const wm = useWindowManager()
    wm.open('about')

    wm.minimize()
    expect(wm.isVisible.value).toBe(false)
    wm.restore()
    expect(wm.isVisible.value).toBe(true)

    wm.close()
    expect(wm.isOpen.value).toBe(false)
    expect(wm.openId.value).toBe(null)
  })

  it('toggles maximize on desktop', () => {
    const wm = useWindowManager()
    wm.open('about')

    expect(wm.isMaximized.value).toBe(false)
    wm.toggleMaximize()
    expect(wm.isMaximized.value).toBe(true)
    wm.toggleMaximize()
    expect(wm.isMaximized.value).toBe(false)
  })

  it('clamps dragged positions to the viewport', () => {
    const wm = useWindowManager()
    wm.open('about')

    wm.moveTo(999999, 999999)
    expect(wm.position.value).toEqual({ x: 1200 - 60, y: 800 - 80 })

    wm.moveTo(-999999, -999999)
    expect(wm.position.value).toEqual({ x: -600, y: 0 })
  })

  it('forces windows to be maximized on mobile viewports', () => {
    setViewport(375, 700)
    const wm = useWindowManager()
    wm.open('about')

    expect(wm.isMobile.value).toBe(true)
    expect(wm.isMaximized.value).toBe(true)
  })
})
