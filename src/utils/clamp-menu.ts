import type { Point } from '@/utils/clamp-window'

export const MENU_WIDTH = 200
export const MENU_HEIGHT = 230

/* Keep the context menu fully inside the viewport. */
export function clampMenuPosition(
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number,
): Point {
  return {
    x: Math.max(0, Math.min(x, viewportWidth - MENU_WIDTH)),
    y: Math.max(0, Math.min(y, viewportHeight - MENU_HEIGHT)),
  }
}
