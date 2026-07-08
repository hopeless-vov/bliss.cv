/* The XP note header date: D/M/YYYY (no zero padding, like the reference). */
export function formatNoteDate(iso: string): string {
  const date = new Date(iso)
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}
