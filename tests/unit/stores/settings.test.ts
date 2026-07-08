import { useSettingsStore } from '@/stores/settings'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

describe('settings store', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setActivePinia(createPinia())
  })

  it('defaults to the bliss wallpaper and the default cursor', () => {
    const store = useSettingsStore()

    expect(store.wallpaper).toBe('bliss')
    expect(store.cursor).toBe('default')
  })

  it('sets wallpaper and cursor', () => {
    const store = useSettingsStore()

    store.setWallpaper('night')
    store.setCursor('crosshair')

    expect(store.wallpaper).toBe('night')
    expect(store.cursor).toBe('crosshair')
  })

  it('persists under the XP keys', async () => {
    const store = useSettingsStore()
    store.setWallpaper('sunset')
    store.setCursor('wait')
    await nextTick()

    expect(window.localStorage.getItem('xp-wallpaper')).toBe('sunset')
    expect(window.localStorage.getItem('xp-cursor')).toBe('wait')
  })
})
