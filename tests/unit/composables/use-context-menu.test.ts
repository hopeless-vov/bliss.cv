import { useContextMenu } from '@/composables/use-context-menu'
import { MENU_HEIGHT, MENU_WIDTH } from '@/utils/clamp-menu'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

function setViewport(w: number, h: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: w })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: h })
  window.dispatchEvent(new Event('resize'))
}

describe('useContextMenu', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setViewport(1200, 800)
  })

  it('shares state across independent calls (backed by a store)', () => {
    const a = useContextMenu()
    const b = useContextMenu()

    a.openAt(10, 20)
    expect(b.isOpen.value).toBe(true)
  })

  it('opens at the clicked position and closes', () => {
    const menu = useContextMenu()
    expect(menu.isOpen.value).toBe(false)

    menu.openAt(100, 150)
    expect(menu.isOpen.value).toBe(true)
    expect(menu.position.value).toEqual({ x: 100, y: 150 })

    menu.close()
    expect(menu.isOpen.value).toBe(false)
  })

  it('clamps the position near viewport edges', () => {
    const menu = useContextMenu()

    menu.openAt(1195, 795)

    expect(menu.position.value).toEqual({ x: 1200 - MENU_WIDTH, y: 800 - MENU_HEIGHT })
  })
})
