import { useDynamicText } from '@/composables/use-dynamic-text'
import { DESKTOP_ITEMS } from '@/config/desktop-items'
import { EXT_BADGE_CLASSES } from '@/config/ext-badges'
import { extFromLabel } from '@/utils/file-ext'
import { computed } from 'vue'

const RIGHT_IDS = ['about', 'skills', 'education', 'resume', 'contact']

/*
 * The start menu's two columns: experience files (left, with file-type badges
 * derived from their labels) and the fixed portfolio items (right).
 */
export function useStartMenuItems() {
  const t = useDynamicText()

  const leftItems = computed(() =>
    DESKTOP_ITEMS.filter((item) => item.kind === 'experience').map((item) => {
      const label = t(`icons.${item.id}`)
      const ext = extFromLabel(label)
      return {
        id: item.id,
        label,
        ext,
        badgeClass: (ext && EXT_BADGE_CLASSES[ext]) || 'bg-badge-exe text-white',
      }
    }),
  )

  const rightItems = computed(() =>
    RIGHT_IDS.map((id) => ({ id, label: t(`startMenu.items.${id}`) })),
  )

  return { leftItems, rightItems }
}
