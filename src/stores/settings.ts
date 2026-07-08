import type { CursorId } from '@/config/cursors'
import type { WallpaperId } from '@/config/wallpapers'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

/* Thin state container for desktop settings, persisted with the XP keys. */
export const useSettingsStore = defineStore('settings', () => {
  const wallpaper = useLocalStorage<WallpaperId>('xp-wallpaper', 'bliss')
  const cursor = useLocalStorage<CursorId>('xp-cursor', 'default')

  function setWallpaper(id: WallpaperId): void {
    wallpaper.value = id
  }

  function setCursor(id: CursorId): void {
    cursor.value = id
  }

  return { wallpaper, cursor, setWallpaper, setCursor }
})
