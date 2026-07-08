import { useClock } from '@/composables/use-clock'
import { describe, expect, it } from 'vitest'

describe('useClock', () => {
  it('produces a 24-hour formatted string', () => {
    const { time } = useClock(true)
    expect(time.value).toMatch(/^\d{2}:\d{2}$/)
  })

  it('produces a 12-hour formatted string', () => {
    const { time } = useClock(false)
    expect(time.value).toMatch(/^\d{1,2}:\d{2} (AM|PM)$/)
  })
})
