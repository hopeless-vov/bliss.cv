import { focusableWithin, nextFocusIndex } from '@/utils/focusable'
import { afterEach, describe, expect, it } from 'vitest'

describe('nextFocusIndex', () => {
  it('returns -1 when there is nothing to focus', () => {
    expect(nextFocusIndex(0, 0, false)).toBe(-1)
  })

  it('advances forward and wraps past the end', () => {
    expect(nextFocusIndex(0, 3, false)).toBe(1)
    expect(nextFocusIndex(2, 3, false)).toBe(0)
  })

  it('advances backward and wraps past the start', () => {
    expect(nextFocusIndex(2, 3, true)).toBe(1)
    expect(nextFocusIndex(0, 3, true)).toBe(2)
  })

  it('treats "nothing focused" (-1) as before the first item', () => {
    expect(nextFocusIndex(-1, 3, false)).toBe(0)
    expect(nextFocusIndex(-1, 3, true)).toBe(2)
  })
})

describe('focusableWithin', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('collects focusable elements and skips disabled / tabindex=-1', () => {
    const root = document.createElement('div')
    root.innerHTML = `
      <button>a</button>
      <button disabled>b</button>
      <a href="#">c</a>
      <div tabindex="-1">d</div>
      <textarea></textarea>
    `
    document.body.appendChild(root)

    expect(focusableWithin(root)).toHaveLength(3)
  })
})
