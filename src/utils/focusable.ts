const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/* Focusable descendants of a container, in DOM order. */
export function focusableWithin(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

/* The index to focus next when cycling within a trap (wraps at both ends). */
export function nextFocusIndex(currentIndex: number, count: number, backward: boolean): number {
  if (count === 0) {
    return -1
  }
  if (backward) {
    return currentIndex <= 0 ? count - 1 : currentIndex - 1
  }
  return currentIndex >= count - 1 ? 0 : currentIndex + 1
}
