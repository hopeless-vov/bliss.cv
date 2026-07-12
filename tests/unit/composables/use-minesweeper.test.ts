import { useMinesweeper } from '@/composables/use-minesweeper'
import { MINE_COUNT, MINE_TOTAL } from '@/utils/minesweeper'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

type Api = ReturnType<typeof useMinesweeper>

function setup(): { api: Api; unmount: () => void } {
  let api!: Api
  const wrapper = mount(
    defineComponent({
      setup() {
        api = useMinesweeper()
        return () => h('div')
      },
    }),
  )
  return { api, unmount: () => wrapper.unmount() }
}

/* Force placeMines to drop its mines on exactly these indices, in order. */
function stubMines(indices: number[]): void {
  const queue = [...indices]
  vi.spyOn(Math, 'random').mockImplementation(() => (queue.shift()! + 0.5) / MINE_TOTAL)
}

describe('useMinesweeper', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('starts ready, with a full mine count and a stopped clock', () => {
    const { api } = setup()

    expect(api.status.value).toBe('ready')
    expect(api.elapsed.value).toBe(0)
    expect(api.minesLeft.value).toBe(MINE_COUNT)
  })

  it('starts the clock on the first reveal and enters play', () => {
    stubMines([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    const { api } = setup()

    api.revealCell(0) // neighbours 1/9/10 are mines → a numbered cell, no win
    expect(api.status.value).toBe('playing')

    vi.advanceTimersByTime(3000)
    expect(api.elapsed.value).toBe(3)
  })

  it('caps the clock at 999', () => {
    stubMines([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    const { api } = setup()
    api.revealCell(0)

    vi.advanceTimersByTime(1_000_000)
    expect(api.elapsed.value).toBe(999)
  })

  it('flags cells, adjusting the counter, and ignores revealing a flag', () => {
    const { api } = setup()

    api.flagCell(2)
    expect(api.minesLeft.value).toBe(MINE_COUNT - 1)

    api.revealCell(2) // flagged → no-op, game not even started
    expect(api.status.value).toBe('ready')
  })

  it('loses and freezes the clock when a mine is revealed', () => {
    stubMines([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    const { api } = setup()

    api.revealCell(0) // safe first move
    vi.advanceTimersByTime(2000)
    api.revealCell(5) // a mine

    expect(api.status.value).toBe('lost')
    vi.advanceTimersByTime(5000)
    expect(api.elapsed.value).toBe(2) // clock stopped at the loss

    // Further input is ignored once the game is over.
    api.flagCell(20)
    api.revealCell(20)
    expect(api.minesLeft.value).toBe(MINE_COUNT)
    expect(api.status.value).toBe('lost')
  })

  it('wins when every safe cell is revealed', () => {
    // A solid 2×5 mine block in the corner; clicking the opposite corner floods
    // the rest of the board.
    stubMines([0, 1, 9, 10, 18, 19, 27, 28, 36, 37])
    const { api } = setup()

    api.revealCell(80)

    expect(api.status.value).toBe('won')
  })

  it('reset returns to a fresh, stopped board', () => {
    stubMines([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    const { api } = setup()
    api.revealCell(0)
    vi.advanceTimersByTime(3000)

    api.reset()

    expect(api.status.value).toBe('ready')
    expect(api.elapsed.value).toBe(0)
    vi.advanceTimersByTime(3000)
    expect(api.elapsed.value).toBe(0) // clock cleared by reset
  })

  it('clears the clock when the scope is disposed', () => {
    stubMines([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    const { api, unmount } = setup()
    api.revealCell(0)

    unmount()

    vi.advanceTimersByTime(5000)
    expect(api.elapsed.value).toBe(0)
  })
})
