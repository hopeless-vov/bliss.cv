/*
 * Pure physics for the offline "dino runner" (the Internet Explorer no-signal
 * game). No canvas, no rAF, no input — just state and a per-frame step, so the
 * jump arc, obstacle spawning, and collision are all unit-testable. The canvas
 * boundary (@/lib/dino-canvas) drives and draws it; use-dino owns the best score.
 */
export const DINO_W = 600
export const DINO_H = 150
export const DINO_GROUND = 118
export const DINO_WIDTH = 22
export const DINO_HEIGHT = 24
const GRAVITY = 0.62
const JUMP_VELOCITY = -12

export interface Obstacle {
  x: number
  w: number
  h: number
}

export interface DinoState {
  /** Horizontal position of the runner (fixed). */
  x: number
  /** Vertical offset from the ground (0 = grounded, negative = airborne). */
  y: number
  vy: number
  jumping: boolean
  obs: Obstacle[]
  /** Frame counter — drives the difficulty ramp. */
  t: number
  speed: number
  score: number
  over: boolean
  /** Frames until the next obstacle spawns. */
  spawn: number
}

export type Rng = () => number

export function createDino(): DinoState {
  return { x: 34, y: 0, vy: 0, jumping: false, obs: [], t: 0, speed: 5, score: 0, over: false, spawn: 50 }
}

/* Jump when grounded; when the run is over, a jump restarts it instead. */
export function jumpDino(state: DinoState): void {
  if (state.over) {
    Object.assign(state, createDino())
    return
  }
  if (!state.jumping) {
    state.vy = JUMP_VELOCITY
    state.jumping = true
  }
}

/*
 * Advance one frame. Mutates `state`. Returns true on the frame the runner
 * first collides (so the caller can record the score). A finished run only
 * ticks its frame counter until jumpDino restarts it.
 */
export function stepDino(state: DinoState, rng: Rng = Math.random): boolean {
  state.t += 1
  if (state.over) return false

  state.vy += GRAVITY
  state.y += state.vy
  if (state.y > 0) {
    state.y = 0
    state.vy = 0
    state.jumping = false
  }

  state.speed = 5 + state.t / 850
  state.spawn -= 1
  if (state.spawn <= 0) {
    state.obs.push({ x: DINO_W + 10, w: 13 + rng() * 12, h: 22 + rng() * 22 })
    state.spawn = Math.max(30, 66 - state.t / 90 + rng() * 30)
  }
  for (const o of state.obs) o.x -= state.speed
  state.obs = state.obs.filter((o) => o.x + o.w > -5)
  state.score += 1

  const dx = state.x
  const dy = DINO_GROUND + state.y
  let crashed = false
  for (const o of state.obs) {
    const oy = DINO_GROUND + 24 - o.h
    if (dx + 3 < o.x + o.w && dx + DINO_WIDTH - 3 > o.x && dy + DINO_HEIGHT > oy && dy < oy + o.h) {
      crashed = true
    }
  }
  if (crashed) state.over = true
  return crashed
}
