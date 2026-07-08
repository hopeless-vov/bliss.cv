import { formatNoteDate } from '@/utils/format-note-date'
import { describe, expect, it } from 'vitest'

describe('formatNoteDate', () => {
  it('formats as D/M/YYYY without zero padding', () => {
    expect(formatNoteDate(new Date(2026, 6, 8).toISOString())).toBe('8/7/2026')
    expect(formatNoteDate(new Date(2026, 11, 31).toISOString())).toBe('31/12/2026')
  })
})
