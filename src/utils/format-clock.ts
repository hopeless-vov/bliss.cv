/* Format a time the way the XP taskbar clock does — 24h (HH:MM) or 12h (h:MM AM/PM). */
export function formatClock(date: Date, is24h: boolean): string {
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')

  if (is24h) {
    return `${hours.toString().padStart(2, '0')}:${minutes}`
  }

  const period = hours < 12 ? 'AM' : 'PM'
  const twelveHour = hours % 12 === 0 ? 12 : hours % 12
  return `${twelveHour}:${minutes} ${period}`
}
