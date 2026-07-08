import { usePointerDrag } from '@/composables/use-pointer-drag'
import { describe, expect, it, vi } from 'vitest'

function pointerEvent(type: string, x: number, y: number): PointerEvent {
  return new MouseEvent(type, { clientX: x, clientY: y }) as PointerEvent
}

describe('usePointerDrag', () => {
  it('reports positions relative to the drag origin', () => {
    const onMove = vi.fn()
    const { start, isDragging } = usePointerDrag<string>(onMove)

    start(pointerEvent('pointerdown', 110, 120), { x: 100, y: 100 }, 'note-1')
    expect(isDragging.value).toBe(true)

    window.dispatchEvent(pointerEvent('pointermove', 130, 150))
    expect(onMove).toHaveBeenCalledWith(120, 130, 'note-1')
  })

  it('ends the drag on pointerup and calls onEnd with the context', () => {
    const onMove = vi.fn()
    const onEnd = vi.fn()
    const { start, isDragging } = usePointerDrag<string>(onMove, onEnd)

    start(pointerEvent('pointerdown', 0, 0), { x: 0, y: 0 }, 'note-2')
    window.dispatchEvent(pointerEvent('pointerup', 0, 0))

    expect(isDragging.value).toBe(false)
    expect(onEnd).toHaveBeenCalledWith('note-2')

    window.dispatchEvent(pointerEvent('pointermove', 50, 50))
    expect(onMove).not.toHaveBeenCalled()
  })

  it('ignores move/up events when no drag is active', () => {
    const onMove = vi.fn()
    const onEnd = vi.fn()
    usePointerDrag(onMove, onEnd)

    window.dispatchEvent(pointerEvent('pointermove', 10, 10))
    window.dispatchEvent(pointerEvent('pointerup', 10, 10))

    expect(onMove).not.toHaveBeenCalled()
    expect(onEnd).not.toHaveBeenCalled()
  })

  it('works without an onEnd callback', () => {
    const { start, isDragging } = usePointerDrag(vi.fn())

    start(pointerEvent('pointerdown', 0, 0), { x: 0, y: 0 })
    window.dispatchEvent(pointerEvent('pointerup', 0, 0))

    expect(isDragging.value).toBe(false)
  })
})
