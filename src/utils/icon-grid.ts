import type { DesktopItem } from '@/types/desktop'
import type { Point } from '@/utils/clamp-window'

const CELL_X = 92
const CELL_Y = 94
const ORIGIN = 14

/*
 * The default desktop icon layout: a left-to-right grid from col/row, except
 * the recycle bin, which always sits in the bottom-right corner regardless of
 * the other icons' positions.
 */
export function defaultIconPosition(
  item: DesktopItem,
  viewportWidth: number,
  viewportHeight: number,
): Point {
  if (item.id === 'recycle') {
    return {
      x: Math.max(120, viewportWidth - 100),
      y: Math.max(120, viewportHeight - 150),
    }
  }

  return {
    x: ORIGIN + (item.col ?? 0) * CELL_X,
    y: ORIGIN + (item.row ?? 0) * CELL_Y,
  }
}
