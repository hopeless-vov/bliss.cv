import { useDesktopStore } from '@/stores/desktop'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

describe('desktop store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with nothing selected', () => {
    expect(useDesktopStore().selectedId).toBe(null)
  })

  it('selects and clears', () => {
    const store = useDesktopStore()

    store.select('about')
    expect(store.selectedId).toBe('about')

    store.clearSelection()
    expect(store.selectedId).toBe(null)
  })
})
