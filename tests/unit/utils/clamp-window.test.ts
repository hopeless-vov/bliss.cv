import {
  ICON_HEIGHT,
  ICON_WIDTH,
  NOTE_HEIGHT,
  NOTE_WIDTH,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  centerWindowPosition,
  clampIconPosition,
  clampNotePosition,
  clampWindowPosition,
} from '@/utils/clamp-window'
import { describe, expect, it } from 'vitest'

describe('clampWindowPosition', () => {
  it('keeps a point that is already in range', () => {
    expect(clampWindowPosition(100, 100, 1200, 800)).toEqual({ x: 100, y: 100 })
  })

  it('clamps to the minimum bounds', () => {
    expect(clampWindowPosition(-9999, -9999, 1200, 800)).toEqual({ x: -600, y: 0 })
  })

  it('clamps to the maximum bounds', () => {
    expect(clampWindowPosition(9999, 9999, 1200, 800)).toEqual({ x: 1140, y: 720 })
  })
})

describe('clampNotePosition', () => {
  it('keeps an in-range point', () => {
    expect(clampNotePosition(100, 100, 1200, 800)).toEqual({ x: 100, y: 100 })
  })

  it('clamps to the desktop area above the taskbar', () => {
    expect(clampNotePosition(9999, 9999, 1200, 800)).toEqual({
      x: 1200 - NOTE_WIDTH,
      y: 800 - 32 - NOTE_HEIGHT,
    })
    expect(clampNotePosition(-50, -50, 1200, 800)).toEqual({ x: 0, y: 0 })
  })

  it('never produces negative bounds on tiny viewports', () => {
    expect(clampNotePosition(50, 50, 100, 100)).toEqual({ x: 0, y: 0 })
  })
})

describe('clampIconPosition', () => {
  it('keeps an in-range point', () => {
    expect(clampIconPosition(100, 100, 1200, 800)).toEqual({ x: 100, y: 100 })
  })

  it('clamps to the desktop area above the taskbar', () => {
    expect(clampIconPosition(9999, 9999, 1200, 800)).toEqual({
      x: 1200 - ICON_WIDTH,
      y: 800 - 32 - ICON_HEIGHT,
    })
    expect(clampIconPosition(-50, -50, 1200, 800)).toEqual({ x: 0, y: 0 })
  })

  it('never produces negative bounds on tiny viewports', () => {
    expect(clampIconPosition(50, 50, 50, 50)).toEqual({ x: 0, y: 0 })
  })
})

describe('centerWindowPosition', () => {
  it('centres within a large viewport', () => {
    expect(centerWindowPosition(1200, 800)).toEqual({
      x: (1200 - WINDOW_WIDTH) / 2,
      y: (800 - 32 - WINDOW_HEIGHT) / 2,
    })
  })

  it('never goes negative on a tiny viewport', () => {
    expect(centerWindowPosition(300, 300)).toEqual({ x: 0, y: 0 })
  })
})
