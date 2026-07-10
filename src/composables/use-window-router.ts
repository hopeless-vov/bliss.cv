import { useWindowManager } from '@/composables/use-window-manager'
import { DESKTOP_ITEMS } from '@/config/desktop-items'
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const WINDOW_IDS = new Set(
  DESKTOP_ITEMS.filter((item) => item.action === 'window').map((item) => item.id),
)

/*
 * Sync between the URL and the *focused* window. A deep link (/vesper) opens
 * and focuses that window; focusing or closing a window rewrites the URL to
 * whatever is on top now (or / when the desktop is empty). Other open windows
 * are left untouched — the URL tracks the focused window, not the whole
 * session, so links stay shareable. Unknown ids redirect to /.
 */
export function useWindowRouter(): void {
  const route = useRoute()
  const router = useRouter()
  const { focusedId, open } = useWindowManager()

  watch(
    () => route.params.windowId,
    (param) => {
      const id = typeof param === 'string' ? param : ''

      if (id && WINDOW_IDS.has(id)) {
        if (focusedId.value !== id) {
          open(id)
        }
        return
      }

      // An unknown id (e.g. /resume, /typo) can't map to a window — bounce to /.
      if (id) {
        router.replace('/')
      }
    },
    { immediate: true },
  )

  watch(focusedId, (id) => {
    const target = id ? `/${id}` : '/'
    if (route.path !== target) {
      router.replace(target)
    }
  })
}
