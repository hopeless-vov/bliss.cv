/* Compact unique id: base36 timestamp + random suffix. */
export function generateId(random: () => number = Math.random): string {
  return `${Date.now().toString(36)}-${random().toString(36).slice(2, 10)}`
}
