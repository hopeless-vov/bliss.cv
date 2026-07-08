import { useIconPositions } from '@/composables/use-icon-positions'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

function setViewport(w: number, h: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: w })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: h })
  window.dispatchEvent(new Event('resize'))
}

describe('useIconPositions', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setActivePinia(createPinia())
    setViewport(1200, 800)
  })

  it('falls back to the default grid position for a known item', () => {
    const icons = useIconPositions()

    expect(icons.positionFor('about')).toEqual({ x: 14 + 92, y: 14 })
  })

  it('returns the origin for an unknown id', () => {
    const icons = useIconPositions()

    expect(icons.positionFor('ghost')).toEqual({ x: 0, y: 0 })
  })

  it('moving an icon overrides its default position, clamped', () => {
    const icons = useIconPositions()

    icons.moveIcon('about', 40, 50)
    expect(icons.positionFor('about')).toEqual({ x: 40, y: 50 })

    icons.moveIcon('about', 99999, 99999)
    expect(icons.positionFor('about')).toEqual({ x: 1200 - 82, y: 800 - 32 - 90 })
  })

  it('arrangeIcons forgets dragged positions, reverting to the grid', () => {
    const icons = useIconPositions()
    icons.moveIcon('about', 500, 500)

    icons.arrangeIcons()

    expect(icons.positionFor('about')).toEqual({ x: 14 + 92, y: 14 })
  })
})
