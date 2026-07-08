import { useEscapeKey } from '@/composables/use-escape-key'
import { describe, expect, it, vi } from 'vitest'

function keydown(key: string): void {
  window.dispatchEvent(new KeyboardEvent('keydown', { key }))
}

describe('useEscapeKey', () => {
  it('runs the handler only on Escape', () => {
    const handler = vi.fn()
    useEscapeKey(handler)

    keydown('a')
    expect(handler).not.toHaveBeenCalled()

    keydown('Escape')
    expect(handler).toHaveBeenCalledTimes(1)
  })
})
