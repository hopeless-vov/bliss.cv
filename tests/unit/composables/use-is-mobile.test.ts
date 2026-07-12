import { useIsMobile } from '@/composables/use-is-mobile'
import { describe, expect, it } from 'vitest'
import { withSetup } from '../test-host'

function setWidth(w: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: w })
  window.dispatchEvent(new Event('resize'))
}

describe('useIsMobile', () => {
  it('is true at or below the mobile breakpoint', () => {
    setWidth(640)
    expect(withSetup(() => useIsMobile()).value).toBe(true)
  })

  it('is false above the mobile breakpoint', () => {
    setWidth(641)
    expect(withSetup(() => useIsMobile()).value).toBe(false)
  })
})
