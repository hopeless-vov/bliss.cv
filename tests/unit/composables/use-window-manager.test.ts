import { useWindowManager } from '@/composables/use-window-manager'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

function setViewport(w: number, h: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: w })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: h })
  window.dispatchEvent(new Event('resize'))
}

function positionOf(wm: ReturnType<typeof useWindowManager>, id: string) {
  return wm.windows.value.find((win) => win.id === id)?.position
}

describe('useWindowManager', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setViewport(1200, 800)
  })

  it('opens a window centred, visible and focused', () => {
    const wm = useWindowManager()
    wm.open('about')

    expect(wm.isOpen('about')).toBe(true)
    expect(wm.isVisible('about')).toBe(true)
    expect(wm.focusedId.value).toBe('about')
    expect(positionOf(wm, 'about')).toEqual({ x: (1200 - 740) / 2, y: (800 - 32 - 540) / 2 })
  })

  it('opens each further window cascaded off the top-most, side by side', () => {
    const wm = useWindowManager()
    wm.open('about')
    const first = { ...positionOf(wm, 'about')! }

    wm.open('skills')

    // Both stay open — the second does not replace the first.
    expect(wm.windows.value.map((win) => win.id)).toEqual(['about', 'skills'])
    expect(positionOf(wm, 'skills')).toEqual({ x: first.x + 18, y: first.y + 18 })
    expect(wm.focusedId.value).toBe('skills')
  })

  it('re-opening an open window focuses it instead of duplicating', () => {
    const wm = useWindowManager()
    wm.open('about')
    wm.open('skills')
    expect(wm.focusedId.value).toBe('skills')

    wm.open('about')

    expect(wm.windows.value).toHaveLength(2)
    expect(wm.focusedId.value).toBe('about')
  })

  it('re-opening a minimized window restores and focuses it', () => {
    const wm = useWindowManager()
    wm.open('about')
    wm.minimize('about')
    expect(wm.isVisible('about')).toBe(false)

    wm.open('about')

    expect(wm.isVisible('about')).toBe(true)
    expect(wm.focusedId.value).toBe('about')
  })

  it('focus raises a window above the others', () => {
    const wm = useWindowManager()
    wm.open('about')
    wm.open('skills')
    expect(wm.focusedId.value).toBe('skills')

    wm.focus('about')

    expect(wm.focusedId.value).toBe('about')
  })

  it('minimize hides a window and hands focus to the next visible one', () => {
    const wm = useWindowManager()
    wm.open('about')
    wm.open('skills')

    wm.minimize('skills')

    expect(wm.isVisible('skills')).toBe(false)
    expect(wm.focusedId.value).toBe('about')
  })

  it('restore shows a window and brings it forward', () => {
    const wm = useWindowManager()
    wm.open('about')
    wm.open('skills')
    wm.minimize('skills')

    wm.restore('skills')

    expect(wm.isVisible('skills')).toBe(true)
    expect(wm.focusedId.value).toBe('skills')
  })

  it('toggleMinimized restores, minimizes or raises depending on state', () => {
    const wm = useWindowManager()
    wm.open('about')
    wm.open('skills')

    // Focused window → minimize.
    wm.toggleMinimized('skills')
    expect(wm.isVisible('skills')).toBe(false)

    // Minimized window → restore + focus.
    wm.toggleMinimized('skills')
    expect(wm.isVisible('skills')).toBe(true)
    expect(wm.focusedId.value).toBe('skills')

    // Non-focused visible window → just raise it.
    wm.toggleMinimized('about')
    expect(wm.focusedId.value).toBe('about')
    expect(wm.isVisible('about')).toBe(true)

    // Unknown id → no-op.
    wm.toggleMinimized('missing')
    expect(wm.focusedId.value).toBe('about')
  })

  it('closes a window and closes the focused one', () => {
    const wm = useWindowManager()
    wm.open('about')
    wm.open('skills')

    wm.closeFocused()
    expect(wm.isOpen('skills')).toBe(false)
    expect(wm.focusedId.value).toBe('about')

    wm.close('about')
    expect(wm.isOpen('about')).toBe(false)
    expect(wm.focusedId.value).toBe(null)

    // Nothing focused → closeFocused is a no-op.
    wm.closeFocused()
    expect(wm.windows.value).toEqual([])
  })

  it('toggles maximize per window and ignores unknown ids', () => {
    const wm = useWindowManager()
    wm.open('about')

    expect(wm.isMaximized('about')).toBe(false)
    wm.toggleMaximize('about')
    expect(wm.isMaximized('about')).toBe(true)
    wm.toggleMaximize('about')
    expect(wm.isMaximized('about')).toBe(false)

    wm.toggleMaximize('missing')
    expect(wm.isMaximized('about')).toBe(false)
  })

  it('clamps a dragged window to the viewport', () => {
    const wm = useWindowManager()
    wm.open('about')

    wm.moveTo('about', 999999, 999999)
    expect(positionOf(wm, 'about')).toEqual({ x: 1200 - 60, y: 800 - 80 })

    wm.moveTo('about', -999999, -999999)
    expect(positionOf(wm, 'about')).toEqual({ x: -600, y: 0 })
  })

  it('reports not-open windows as hidden and not maximized', () => {
    const wm = useWindowManager()

    expect(wm.isOpen('about')).toBe(false)
    expect(wm.isVisible('about')).toBe(false)
    expect(wm.isMaximized('about')).toBe(false)
  })

  it('forces windows to be maximized on mobile viewports', () => {
    setViewport(375, 700)
    const wm = useWindowManager()
    wm.open('about')

    expect(wm.isMobile.value).toBe(true)
    expect(wm.isMaximized('about')).toBe(true)
  })
})
