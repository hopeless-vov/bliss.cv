export type WallpaperId = 'bliss' | 'greenHills' | 'sunset' | 'night' | 'none'

export interface WallpaperOption {
  id: WallpaperId
  /** i18n key of the context-menu label. */
  labelKey: string
  /** Static class defined in main.css (Tailwind must see literal names). */
  class: string
}

export const WALLPAPERS: WallpaperOption[] = [
  { id: 'bliss', labelKey: 'context.wallpaperBliss', class: 'xp-wall-bliss' },
  { id: 'greenHills', labelKey: 'context.wallpaperGreenHills', class: 'xp-wall-green-hills' },
  { id: 'sunset', labelKey: 'context.wallpaperSunset', class: 'xp-wall-sunset' },
  { id: 'night', labelKey: 'context.wallpaperNight', class: 'xp-wall-night' },
  { id: 'none', labelKey: 'context.wallpaperNone', class: 'xp-wall-none' },
]
