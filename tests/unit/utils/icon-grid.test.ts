import { defaultIconPosition } from '@/utils/icon-grid'
import { describe, expect, it } from 'vitest'

describe('defaultIconPosition', () => {
  it('places an item on the grid from its col/row', () => {
    expect(defaultIconPosition({ id: 'about', col: 1, row: 2 } as never, 1200, 800)).toEqual({
      x: 14 + 92,
      y: 14 + 2 * 94,
    })
  })

  it('defaults missing col/row to the origin cell', () => {
    expect(defaultIconPosition({ id: 'vesper' } as never, 1200, 800)).toEqual({ x: 14, y: 14 })
  })

  it('always places the recycle bin in the bottom-right corner', () => {
    expect(defaultIconPosition({ id: 'recycle' } as never, 1200, 800)).toEqual({
      x: 1200 - 100,
      y: 800 - 150,
    })
  })

  it('keeps the recycle bin on-screen on tiny viewports', () => {
    expect(defaultIconPosition({ id: 'recycle' } as never, 150, 200)).toEqual({ x: 120, y: 120 })
  })
})
