import { useSettings } from '@/composables/use-settings'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

describe('useSettings', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setActivePinia(createPinia())
  })

  it('exposes the wallpaper and its CSS class', () => {
    const settings = useSettings()

    expect(settings.wallpaper.value).toBe('bliss')
    expect(settings.wallpaperClass.value).toBe('xp-wall-bliss')

    settings.setWallpaper('night')
    expect(settings.wallpaperClass.value).toBe('xp-wall-night')
  })

  it('falls back to bliss when the persisted wallpaper id is unknown', () => {
    window.localStorage.setItem('xp-wallpaper', 'corrupted-id')
    const settings = useSettings()

    expect(settings.wallpaperClass.value).toBe('xp-wall-bliss')
  })

  it('exposes the cursor and its Tailwind utility class', () => {
    const settings = useSettings()

    expect(settings.cursor.value).toBe('default')
    expect(settings.cursorClass.value).toBe('cursor-default')

    settings.setCursor('crosshair')
    expect(settings.cursorClass.value).toBe('cursor-crosshair')
  })

  it('falls back to the default cursor when the persisted id is unknown', () => {
    window.localStorage.setItem('xp-cursor', 'corrupted-id')
    const settings = useSettings()

    expect(settings.cursorClass.value).toBe('cursor-default')
  })
})
