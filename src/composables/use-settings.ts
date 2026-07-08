import type { CursorId } from '@/config/cursors'
import { CURSORS } from '@/config/cursors'
import type { WallpaperId } from '@/config/wallpapers'
import { WALLPAPERS } from '@/config/wallpapers'
import { useSettingsStore } from '@/stores/settings'
import { computed } from 'vue'

/* Desktop settings behaviour: wallpaper choice and cursor theme. */
export function useSettings() {
  const store = useSettingsStore()

  const wallpaper = computed(() => store.wallpaper)
  const wallpaperClass = computed(
    () => WALLPAPERS.find((option) => option.id === store.wallpaper)?.class ?? 'xp-wall-bliss',
  )

  const cursor = computed(() => store.cursor)
  const cursorClass = computed(
    () => CURSORS.find((option) => option.id === store.cursor)?.class ?? 'cursor-default',
  )

  function setWallpaper(id: WallpaperId): void {
    store.setWallpaper(id)
  }

  function setCursor(id: CursorId): void {
    store.setCursor(id)
  }

  return { wallpaper, wallpaperClass, cursor, cursorClass, setWallpaper, setCursor }
}
