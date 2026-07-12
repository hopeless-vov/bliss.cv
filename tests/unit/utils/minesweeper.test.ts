import {
  createGrid,
  formatLed,
  MINE_COUNT,
  MINE_TOTAL,
  minesRemaining,
  type MineCell,
  neighbors,
  placeMines,
  reveal,
  toggleFlag,
} from '@/utils/minesweeper'
import { describe, expect, it } from 'vitest'

/* Deterministic grid: set mines at the given indices, then fill adjacency. */
function buildGrid(mines: number[]): MineCell[] {
  const grid = createGrid()
  for (const m of mines) grid[m].mine = true
  for (let i = 0; i < MINE_TOTAL; i++) {
    grid[i].adjacent = grid[i].mine ? 0 : neighbors(i).filter((n) => grid[n].mine).length
  }
  return grid
}

/* An RNG that yields Math.floor(rng()*81) === each queued index in turn. */
function rngFor(indices: number[]): () => number {
  const queue = [...indices]
  return () => (queue.shift()! + 0.5) / MINE_TOTAL
}

describe('minesweeper', () => {
  it('creates a blank 81-cell grid', () => {
    const grid = createGrid()
    expect(grid).toHaveLength(MINE_TOTAL)
    expect(grid.every((c) => !c.mine && !c.revealed && !c.flagged)).toBe(true)
  })

  it('computes neighbours for corners, edges and centre', () => {
    expect(neighbors(0).sort((a, b) => a - b)).toEqual([1, 9, 10])
    expect(neighbors(80).sort((a, b) => a - b)).toEqual([70, 71, 79])
    expect(neighbors(40)).toHaveLength(8)
  })

  it('places mines off the safe cell and fills adjacency', () => {
    // 0 is the safe click, the duplicate 1 is skipped — both exercise `continue`.
    const grid = placeMines(createGrid(), 0, rngFor([0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))

    expect(grid.filter((c) => c.mine)).toHaveLength(MINE_COUNT)
    expect(grid[0].mine).toBe(false)
    expect(grid[1].mine).toBe(true)
    expect(grid[1].adjacent).toBe(0) // mine cells carry no count
    // Cell 0's neighbours 1, 9, 10 are all mines.
    expect(grid[0].adjacent).toBe(3)
  })

  it('reveals a mine as a loss, showing every mine and the exploded one', () => {
    const result = reveal(buildGrid([40]), 40)

    expect(result.status).toBe('lost')
    expect(result.grid[40].exploded).toBe(true)
    expect(result.grid[40].revealed).toBe(true)
  })

  it('flood-fills the empty region from a blank cell', () => {
    // One mine in the far corner: revealing (0,0) cascades across the board.
    const result = reveal(buildGrid([80]), 0)

    expect(result.status).toBe('won')
    expect(result.grid.filter((c) => c.revealed && !c.mine)).toHaveLength(MINE_TOTAL - 1)
    expect(result.grid[80].flagged).toBe(true) // won → mines auto-flagged
  })

  it('reveals only a numbered cell without expanding', () => {
    const result = reveal(buildGrid([1]), 0)

    expect(result.status).toBe('playing')
    expect(result.grid[0].revealed).toBe(true)
    expect(result.grid[2].revealed).toBe(false)
  })

  it('ignores revealing a flagged or already-revealed cell', () => {
    const flagged = toggleFlag(buildGrid([1]), 5)
    expect(reveal(flagged, 5).grid[5].revealed).toBe(false)

    const once = reveal(buildGrid([1]), 0)
    const twice = reveal(once.grid, 0)
    expect(twice.status).toBe('playing')
    expect(twice.grid[2].revealed).toBe(false)
  })

  it('toggles a flag only on unrevealed cells', () => {
    let grid = toggleFlag(buildGrid([]), 3)
    expect(grid[3].flagged).toBe(true)
    grid = toggleFlag(grid, 3)
    expect(grid[3].flagged).toBe(false)

    grid[4].revealed = true
    expect(toggleFlag(grid, 4)[4].flagged).toBe(false)
  })

  it('counts mines remaining as total minus flags', () => {
    const grid = toggleFlag(toggleFlag(buildGrid([]), 0), 1)
    expect(minesRemaining(grid)).toBe(MINE_COUNT - 2)
  })

  it('formats the LED counter with sign and clamping', () => {
    expect(formatLed(0)).toBe('000')
    expect(formatLed(9)).toBe('009')
    expect(formatLed(999)).toBe('999')
    expect(formatLed(-5)).toBe('-05')
    expect(formatLed(-99)).toBe('-99')
    expect(formatLed(1500)).toBe('999') // clamped high
    expect(formatLed(-200)).toBe('-99') // clamped low
  })
})
