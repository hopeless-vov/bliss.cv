import type { MineCell, MineStatus } from '@/utils/minesweeper'
import { createGrid, minesRemaining, placeMines, reveal, toggleFlag } from '@/utils/minesweeper'
import { computed, onScopeDispose, readonly, ref, shallowRef } from 'vue'

/*
 * Reactive Minesweeper: wraps the pure rules in `@/utils/minesweeper` with the
 * board state, the running clock, and first-click mine placement. The timer
 * starts on the first reveal and stops when the game ends; it's cleared on
 * scope dispose so a closed window never leaks an interval.
 */
export function useMinesweeper() {
  const grid = shallowRef<MineCell[]>(createGrid())
  const status = ref<MineStatus>('ready')
  const elapsed = ref(0)
  let firstMove = true
  let timer: ReturnType<typeof setInterval> | null = null

  function stopTimer(): void {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function startTimer(): void {
    stopTimer()
    timer = setInterval(() => {
      if (elapsed.value < 999) elapsed.value += 1
    }, 1000)
  }

  const isOver = (): boolean => status.value === 'won' || status.value === 'lost'

  function reset(): void {
    stopTimer()
    grid.value = createGrid()
    status.value = 'ready'
    elapsed.value = 0
    firstMove = true
  }

  function revealCell(index: number): void {
    if (isOver() || grid.value[index].flagged) return

    let board = grid.value
    if (firstMove) {
      board = placeMines(board, index)
      firstMove = false
      startTimer()
    }

    const result = reveal(board, index)
    grid.value = result.grid
    status.value = result.status
    if (isOver()) stopTimer()
  }

  function flagCell(index: number): void {
    if (isOver()) return
    grid.value = toggleFlag(grid.value, index)
  }

  onScopeDispose(stopTimer)

  const minesLeft = computed(() => minesRemaining(grid.value))

  return {
    grid: readonly(grid),
    status: readonly(status),
    elapsed: readonly(elapsed),
    minesLeft,
    reset,
    revealCell,
    flagCell,
  }
}
