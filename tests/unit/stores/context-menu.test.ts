import { useContextMenuStore } from '@/stores/context-menu'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

describe('context-menu store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts closed', () => {
    expect(useContextMenuStore().open).toBe(false)
  })

  it('shows at a position and hides', () => {
    const store = useContextMenuStore()

    store.show({ x: 40, y: 50 })
    expect(store.open).toBe(true)
    expect(store.position).toEqual({ x: 40, y: 50 })

    store.hide()
    expect(store.open).toBe(false)
  })
})
