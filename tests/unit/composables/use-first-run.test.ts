import { useFirstRun } from '@/composables/use-first-run'
import { beforeEach, describe, expect, it } from 'vitest'

describe('useFirstRun', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('reports the first run, then not once marked seen', () => {
    const { isFirstRun, markSeen } = useFirstRun()

    expect(isFirstRun()).toBe(true)

    markSeen()
    expect(isFirstRun()).toBe(false)
  })

  it('reads a persisted visit from a previous session', () => {
    window.localStorage.setItem('xp-visited', 'true')

    expect(useFirstRun().isFirstRun()).toBe(false)
  })
})
