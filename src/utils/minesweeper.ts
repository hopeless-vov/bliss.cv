/*
 * Pure Minesweeper rules — no reactivity, no timers, no DOM. The composable
 * (use-minesweeper) owns the reactive state and clock; this module is the
 * game logic, kept pure so every branch is unit-testable. Classic Beginner
 * board: 9×9 with 10 mines.
 */
export const MINE_ROWS = 9
export const MINE_COLS = 9
export const MINE_TOTAL = MINE_ROWS * MINE_COLS
export const MINE_COUNT = 10

export interface MineCell {
  mine: boolean
  revealed: boolean
  flagged: boolean
  /** Count of neighbouring mines; only meaningful once mines are placed. */
  adjacent: number
  /** The mine the player detonated (for the red "boom" cell). */
  exploded: boolean
}

export type MineStatus = 'ready' | 'playing' | 'won' | 'lost'

export type Rng = () => number

function emptyCell(): MineCell {
  return { mine: false, revealed: false, flagged: false, adjacent: 0, exploded: false }
}

export function createGrid(): MineCell[] {
  return Array.from({ length: MINE_TOTAL }, emptyCell)
}

/** Indices of the (up to 8) cells surrounding `index`. */
export function neighbors(index: number): number[] {
  const row = Math.floor(index / MINE_COLS)
  const col = index % MINE_COLS
  const out: number[] = []
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = row + dr
      const nc = col + dc
      if (nr >= 0 && nr < MINE_ROWS && nc >= 0 && nc < MINE_COLS) {
        out.push(nr * MINE_COLS + nc)
      }
    }
  }
  return out
}

/*
 * Return a fresh grid with MINE_COUNT mines placed (never on `safeIndex`, so the
 * first click is always safe) and every cell's adjacency count filled in.
 */
export function placeMines(grid: MineCell[], safeIndex: number, rng: Rng = Math.random): MineCell[] {
  const next = grid.map((cell) => ({ ...cell }))
  let placed = 0
  while (placed < MINE_COUNT) {
    const i = Math.floor(rng() * MINE_TOTAL)
    if (i === safeIndex || next[i].mine) continue
    next[i].mine = true
    placed++
  }
  for (let i = 0; i < MINE_TOTAL; i++) {
    next[i].adjacent = next[i].mine ? 0 : neighbors(i).filter((n) => next[n].mine).length
  }
  return next
}

export interface RevealResult {
  grid: MineCell[]
  status: MineStatus
}

/*
 * Reveal the cell at `index`. Revealing a mine loses (all mines shown, the
 * clicked one flagged as exploded); revealing a blank cell flood-fills its
 * empty region. Winning = every non-mine cell revealed (mines auto-flagged).
 * Flagged cells are never revealed.
 */
export function reveal(grid: MineCell[], index: number): RevealResult {
  const next = grid.map((cell) => ({ ...cell }))

  if (next[index].flagged || next[index].revealed) {
    return { grid: next, status: 'playing' }
  }

  if (next[index].mine) {
    next.forEach((cell) => {
      if (cell.mine) cell.revealed = true
    })
    next[index].exploded = true
    return { grid: next, status: 'lost' }
  }

  const stack = [index]
  while (stack.length) {
    const j = stack.pop()!
    if (next[j].revealed || next[j].flagged) continue
    next[j].revealed = true
    if (next[j].adjacent === 0) {
      for (const n of neighbors(j)) {
        if (!next[n].revealed && !next[n].mine) stack.push(n)
      }
    }
  }

  const won = next.every((cell) => cell.mine || cell.revealed)
  if (won) {
    next.forEach((cell) => {
      if (cell.mine) cell.flagged = true
    })
    return { grid: next, status: 'won' }
  }

  return { grid: next, status: 'playing' }
}

/** Toggle a flag on an unrevealed cell (revealed cells can't be flagged). */
export function toggleFlag(grid: MineCell[], index: number): MineCell[] {
  const next = grid.map((cell) => ({ ...cell }))
  if (!next[index].revealed) {
    next[index].flagged = !next[index].flagged
  }
  return next
}

/** Mines minus flags placed — the number shown on the counter (can go negative). */
export function minesRemaining(grid: MineCell[]): number {
  const flags = grid.filter((cell) => cell.flagged && !cell.revealed).length
  return MINE_COUNT - flags
}

/*
 * Format a value for the 3-digit LED counters (mines-left and timer). Clamped
 * to the classic [-99, 999] range; negatives render as a sign plus two digits
 * ("-05"), positives as three ("009"), like the real Minesweeper display.
 */
export function formatLed(value: number): string {
  const clamped = Math.max(-99, Math.min(999, value))
  return clamped < 0 ? `-${String(-clamped).padStart(2, '0')}` : String(clamped).padStart(3, '0')
}
