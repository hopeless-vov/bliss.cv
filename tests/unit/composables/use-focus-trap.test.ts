import { useFocusTrap } from '@/composables/use-focus-trap'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ref } from 'vue'

let container: HTMLElement
let first: HTMLButtonElement
let last: HTMLButtonElement

function tab(shiftKey = false): void {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey, cancelable: true }))
}

beforeEach(() => {
  container = document.createElement('div')
  first = document.createElement('button')
  last = document.createElement('button')
  container.append(first, last)
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.innerHTML = ''
})

describe('useFocusTrap', () => {
  it('wraps focus from last to first on Tab', () => {
    useFocusTrap(ref(container), () => true)
    last.focus()

    tab()

    expect(document.activeElement).toBe(first)
  })

  it('wraps focus from first to last on Shift+Tab', () => {
    useFocusTrap(ref(container), () => true)
    first.focus()

    tab(true)

    expect(document.activeElement).toBe(last)
  })

  it('ignores non-Tab keys', () => {
    useFocusTrap(ref(container), () => true)
    last.focus()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))

    expect(document.activeElement).toBe(last)
  })

  it('does nothing when inactive', () => {
    useFocusTrap(ref(container), () => false)
    last.focus()

    tab()

    expect(document.activeElement).toBe(last)
  })

  it('does nothing when the container ref is empty', () => {
    useFocusTrap(ref(null), () => true)
    last.focus()

    expect(() => tab()).not.toThrow()
    expect(document.activeElement).toBe(last)
  })

  it('does nothing when there is nothing focusable inside', () => {
    const empty = ref(document.createElement('div'))
    document.body.appendChild(empty.value)
    useFocusTrap(empty, () => true)
    last.focus()

    tab()

    expect(document.activeElement).toBe(last)
  })
})
