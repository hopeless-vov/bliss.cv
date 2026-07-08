import { formatClock } from '@/utils/format-clock'
import { describe, expect, it } from 'vitest'

describe('formatClock', () => {
  it('pads hours and minutes in 24-hour mode', () => {
    expect(formatClock(new Date(2020, 0, 1, 9, 5), true)).toBe('09:05')
    expect(formatClock(new Date(2020, 0, 1, 23, 59), true)).toBe('23:59')
  })

  it('formats AM/PM and maps midnight and noon to 12 in 12-hour mode', () => {
    expect(formatClock(new Date(2020, 0, 1, 0, 0), false)).toBe('12:00 AM')
    expect(formatClock(new Date(2020, 0, 1, 12, 0), false)).toBe('12:00 PM')
    expect(formatClock(new Date(2020, 0, 1, 13, 7), false)).toBe('1:07 PM')
    expect(formatClock(new Date(2020, 0, 1, 11, 30), false)).toBe('11:30 AM')
  })
})
