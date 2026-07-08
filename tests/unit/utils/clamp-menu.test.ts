import { clampMenuPosition, MENU_HEIGHT, MENU_WIDTH } from '@/utils/clamp-menu'
import { describe, expect, it } from 'vitest'

describe('clampMenuPosition', () => {
  it('keeps an in-range point', () => {
    expect(clampMenuPosition(100, 100, 1200, 800)).toEqual({ x: 100, y: 100 })
  })

  it('clamps near the right/bottom edges so the menu stays visible', () => {
    expect(clampMenuPosition(1190, 790, 1200, 800)).toEqual({
      x: 1200 - MENU_WIDTH,
      y: 800 - MENU_HEIGHT,
    })
  })

  it('never goes negative', () => {
    expect(clampMenuPosition(-10, -10, 100, 100)).toEqual({ x: 0, y: 0 })
  })
})
