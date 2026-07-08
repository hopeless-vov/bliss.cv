import { useIconPositionsStore } from '@/stores/icon-positions'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

describe('icon-positions store', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setActivePinia(createPinia())
  })

  it('starts empty', () => {
    expect(useIconPositionsStore().positions).toEqual({})
  })

  it('sets a position per id without touching others', () => {
    const store = useIconPositionsStore()

    store.setPosition('about', { x: 10, y: 20 })
    store.setPosition('skills', { x: 30, y: 40 })

    expect(store.positions).toEqual({ about: { x: 10, y: 20 }, skills: { x: 30, y: 40 } })
  })

  it('overwrites an existing position', () => {
    const store = useIconPositionsStore()
    store.setPosition('about', { x: 10, y: 20 })

    store.setPosition('about', { x: 99, y: 99 })

    expect(store.positions.about).toEqual({ x: 99, y: 99 })
  })

  it('clears all positions', () => {
    const store = useIconPositionsStore()
    store.setPosition('about', { x: 10, y: 20 })

    store.clear()

    expect(store.positions).toEqual({})
  })

  it('persists under the XP key', async () => {
    const store = useIconPositionsStore()
    store.setPosition('about', { x: 10, y: 20 })
    await nextTick()

    expect(JSON.parse(window.localStorage.getItem('xp-icon-pos') ?? '{}')).toEqual({
      about: { x: 10, y: 20 },
    })
  })
})
