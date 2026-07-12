import {
  createDino,
  DINO_GROUND,
  type DinoState,
  jumpDino,
  stepDino,
} from '@/utils/dino-physics'
import { describe, expect, it } from 'vitest'

describe('dino-physics', () => {
  it('creates a grounded runner at the start line', () => {
    const s = createDino()
    expect(s).toMatchObject({ x: 34, y: 0, vy: 0, jumping: false, over: false, score: 0 })
    expect(s.obs).toEqual([])
  })

  it('jumps from the ground and ignores a mid-air jump', () => {
    const s = createDino()

    jumpDino(s)
    expect(s.jumping).toBe(true)
    expect(s.vy).toBeLessThan(0)

    const vy = s.vy
    jumpDino(s) // already airborne → no double jump
    expect(s.vy).toBe(vy)
  })

  it('restarts a finished run on jump', () => {
    const s = createDino()
    s.over = true
    s.score = 500

    jumpDino(s)

    expect(s.over).toBe(false)
    expect(s.score).toBe(0)
  })

  it('applies gravity and lands back on the ground', () => {
    const s = createDino()
    jumpDino(s)
    stepDino(s, () => 0)
    expect(s.y).toBeLessThan(0) // airborne

    // Force a descent that overshoots the ground → clamped to 0.
    s.y = -1
    s.vy = 5
    stepDino(s, () => 0)
    expect(s.y).toBe(0)
    expect(s.jumping).toBe(false)
  })

  it('spawns an obstacle when the spawn counter runs out', () => {
    const s = createDino()
    s.spawn = 1

    stepDino(s, () => 0)

    expect(s.obs).toHaveLength(1)
    expect(s.obs[0]).toMatchObject({ w: 13, h: 22 }) // rng()=0 → minimum size
    expect(s.score).toBe(1)
  })

  it('scrolls obstacles left and drops ones that leave the screen', () => {
    const s = createDino()
    s.spawn = 999
    s.obs = [{ x: -6, w: 5, h: 20 }] // x + w = -1; after moving ~5 left it clears the -5 cutoff

    stepDino(s, () => 0)

    expect(s.obs).toEqual([]) // moved off the left edge and pruned
  })

  it('detects a collision and ends the run', () => {
    const s = createDino()
    s.spawn = 999
    s.obs = [{ x: s.x, w: 22, h: 24 }] // sitting right on the runner

    const crashed = stepDino(s, () => 0)

    expect(crashed).toBe(true)
    expect(s.over).toBe(true)
  })

  it('only ticks the frame counter once over', () => {
    const s = createDino()
    s.over = true
    const t = s.t

    const crashed = stepDino(s, () => 0)

    expect(crashed).toBe(false)
    expect(s.t).toBe(t + 1)
    expect(s.score).toBe(0) // no scoring while over
  })

  it('keeps the collision box anchored to the ground line', () => {
    // Guards the DINO_GROUND anchor the canvas relies on.
    const s: DinoState = { ...createDino(), obs: [{ x: 34, w: 22, h: 24 }], spawn: 999 }
    stepDino(s, () => 0)
    expect(DINO_GROUND).toBe(118)
    expect(s.over).toBe(true)
  })
})
