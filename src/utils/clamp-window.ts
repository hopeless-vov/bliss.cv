export interface Point {
  x: number
  y: number
}

export const WINDOW_WIDTH = 740
export const WINDOW_HEIGHT = 540
export const TASKBAR_HEIGHT = 32

/*
 * Keep a window's top-left within reach of the viewport. Matches the reference
 * clamp: the window can slide mostly off-screen but never fully out of grab
 * range, and never under the taskbar.
 */
export function clampWindowPosition(
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number,
): Point {
  const minX = -600
  const maxX = viewportWidth - 60
  const minY = 0
  const maxY = viewportHeight - 80

  return {
    x: Math.min(Math.max(x, minX), maxX),
    y: Math.min(Math.max(y, minY), maxY),
  }
}

/* The centred spawn position for a freshly opened window. */
export function centerWindowPosition(viewportWidth: number, viewportHeight: number): Point {
  return {
    x: Math.max(0, (viewportWidth - WINDOW_WIDTH) / 2),
    y: Math.max(0, (viewportHeight - TASKBAR_HEIGHT - WINDOW_HEIGHT) / 2),
  }
}

export const NOTE_WIDTH = 210
export const NOTE_HEIGHT = 170

/* Keep a sticky note fully inside the desktop area (above the taskbar). */
export function clampNotePosition(
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number,
): Point {
  const maxX = Math.max(0, viewportWidth - NOTE_WIDTH)
  const maxY = Math.max(0, viewportHeight - TASKBAR_HEIGHT - NOTE_HEIGHT)

  return {
    x: Math.min(Math.max(x, 0), maxX),
    y: Math.min(Math.max(y, 0), maxY),
  }
}

export const ICON_WIDTH = 82
export const ICON_HEIGHT = 90

/* Keep a dragged desktop icon fully inside the desktop area (above the taskbar). */
export function clampIconPosition(
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number,
): Point {
  const maxX = Math.max(0, viewportWidth - ICON_WIDTH)
  const maxY = Math.max(0, viewportHeight - TASKBAR_HEIGHT - ICON_HEIGHT)

  return {
    x: Math.min(Math.max(x, 0), maxX),
    y: Math.min(Math.max(y, 0), maxY),
  }
}
