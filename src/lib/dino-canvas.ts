import { createDino, DINO_GROUND, DINO_H, DINO_W, jumpDino, stepDino } from '@/utils/dino-physics'

/*
 * Canvas boundary for the offline dino runner: owns the <canvas>, the
 * requestAnimationFrame loop, drawing, and keyboard input. The game maths lives
 * in @/utils/dino-physics (pure, tested); this file is the untested I/O edge,
 * used only through use-dino (never imported by a component directly).
 *
 * The on-screen score is frame-count/5 so it ticks at a readable pace; `best`
 * is handed in (and reported back via onCrash) in those same display units.
 */
export interface DinoLabels {
  gameOver: string
  restart: string
  hint: string
}

export interface DinoOptions {
  best: number
  labels: DinoLabels
  onCrash: (score: number) => void
}

export interface DinoHandle {
  jump: () => void
  destroy: () => void
}

const GROUND_LINE = DINO_GROUND + 24
const CLOUDS = [
  { x: 120, y: 34, s: 0.4 },
  { x: 360, y: 60, s: 0.25 },
  { x: 520, y: 28, s: 0.55 },
]

const displayScore = (frames: number): number => Math.floor(frames / 5)
const pad = (n: number): string => String(n).padStart(5, '0')

export function startDinoRunner(canvas: HTMLCanvasElement, opts: DinoOptions): DinoHandle {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return { jump: () => {}, destroy: () => {} }
  }

  const state = createDino()
  const clouds = CLOUDS.map((c) => ({ ...c }))
  let best = opts.best
  let started = false
  let raf = 0
  let alive = true

  const jump = (): void => {
    if (!state.over) started = true
    jumpDino(state)
  }

  function drawCloud(x: number, y: number): void {
    ctx!.beginPath()
    ctx!.arc(x, y, 8, 0, Math.PI * 2)
    ctx!.arc(x + 10, y + 2, 10, 0, Math.PI * 2)
    ctx!.arc(x + 22, y, 8, 0, Math.PI * 2)
    ctx!.fill()
  }

  function draw(): void {
    ctx!.fillStyle = '#fff'
    ctx!.fillRect(0, 0, DINO_W, DINO_H)

    // Drifting clouds.
    ctx!.fillStyle = '#e6e6e6'
    for (const c of clouds) {
      c.x -= c.s
      if (c.x < -30) c.x = DINO_W + 20
      drawCloud(c.x, c.y)
    }

    // Ground.
    ctx!.strokeStyle = '#535353'
    ctx!.lineWidth = 1.5
    ctx!.beginPath()
    ctx!.moveTo(0, GROUND_LINE)
    ctx!.lineTo(DINO_W, GROUND_LINE)
    ctx!.stroke()

    // Cacti.
    ctx!.fillStyle = '#2f7d32'
    for (const o of state.obs) {
      const oy = GROUND_LINE - o.h
      ctx!.fillRect(o.x, oy, o.w, o.h)
      ctx!.fillRect(o.x - 4, oy + o.h * 0.35, 4, o.h * 0.28)
      ctx!.fillRect(o.x + o.w, oy + o.h * 0.2, 4, o.h * 0.28)
    }

    // Runner.
    ctx!.fillStyle = '#535353'
    const bx = state.x
    const by = DINO_GROUND + state.y
    ctx!.fillRect(bx, by + 2, 20, 20)
    ctx!.fillRect(bx + 13, by - 8, 13, 13)
    ctx!.fillRect(bx + 24, by - 3, 4, 4)
    ctx!.fillStyle = '#fff'
    ctx!.fillRect(bx + 22, by - 5, 2.4, 2.4)
    ctx!.fillStyle = '#535353'
    const legUp = Math.floor(state.t / 6) % 2 === 0 && !state.jumping
    ctx!.fillRect(bx + 2, by + 22, 5, legUp ? 6 : 3)
    ctx!.fillRect(bx + 12, by + 22, 5, legUp ? 3 : 6)

    // HUD.
    ctx!.font = 'bold 13px "Courier New", monospace'
    ctx!.textAlign = 'right'
    ctx!.fillStyle = '#8a8a8a'
    ctx!.fillText(`HI ${pad(best)}   ${pad(displayScore(state.score))}`, DINO_W - 10, 20)

    if (!started) {
      ctx!.textAlign = 'center'
      ctx!.fillStyle = '#8a8a8a'
      ctx!.font = '12px "Courier New", monospace'
      ctx!.fillText(opts.labels.hint, DINO_W / 2, DINO_H / 2)
    }

    if (state.over) {
      ctx!.textAlign = 'center'
      ctx!.fillStyle = '#535353'
      ctx!.font = 'bold 17px "Courier New", monospace'
      ctx!.fillText(opts.labels.gameOver, DINO_W / 2, DINO_H / 2 - 4)
      ctx!.font = '11px "Courier New", monospace'
      ctx!.fillText(opts.labels.restart, DINO_W / 2, DINO_H / 2 + 16)
    }
  }

  function loop(): void {
    if (!alive) return
    const crashed = started ? stepDino(state) : false
    if (crashed) {
      const score = displayScore(state.score)
      if (score > best) {
        best = score
        opts.onCrash(score)
      }
    }
    draw()
    raf = requestAnimationFrame(loop)
  }

  const onKey = (e: KeyboardEvent): void => {
    if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') {
      e.preventDefault()
      jump()
    }
  }
  window.addEventListener('keydown', onKey)
  raf = requestAnimationFrame(loop)

  return {
    jump,
    destroy: () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
    },
  }
}
