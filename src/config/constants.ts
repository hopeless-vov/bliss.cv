/* Shared timing and layout constants, in one place instead of scattered literals. */

/** Boot screen auto-dismiss delay (ms). */
export const BOOT_DURATION = 3400

/** Taskbar clock refresh interval (ms) — the XP cadence. */
export const CLOCK_INTERVAL = 15_000

/** Viewport width at/below which windows go full-screen and dragging is disabled (px). */
export const MOBILE_BREAKPOINT = 640

/** Pixel offset a window cascades by when the open window switches. */
export const WINDOW_CASCADE_STEP = 18

/**
 * Windows a first-time visitor lands on, with viewport-relative top-left
 * positions (fractions of width/height). Order matters: the last one opens on
 * top / focused. Contact sits lower-left, About upper-right and focused.
 */
export const DEFAULT_WINDOW_LAYOUT = [
  { id: 'contact', x: 0.06, y: 0.3 },
  { id: 'about', x: 0.4, y: 0.12 },
] as const
