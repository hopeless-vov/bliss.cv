import { useWindowManager } from '@/composables/use-window-manager'
import { DESKTOP_ITEMS } from '@/config/desktop-items'
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const WINDOW_IDS = new Set(
  DESKTOP_ITEMS.filter((item) => item.action === 'window').map((item) => item.id),
)

/*
 * Two-way sync between the open window and the URL. /vesper opens the Vesper
 * window (deep link, back/forward work); opening or closing a window from the
 * UI rewrites the URL. Unknown ids redirect to /.
 */
export function useWindowRouter(): void {
  const route = useRoute()
  const router = useRouter()
  const { openId, isOpen, open, close } = useWindowManager()

  watch(
    () => route.params.windowId,
    (param) => {
      const id = typeof param === 'string' ? param : ''

      if (id && WINDOW_IDS.has(id)) {
        if (openId.value !== id) {
          open(id)
        }
        return
      }

      if (isOpen.value) {
        close()
      }
      if (id) {
        router.replace('/')
      }
    },
    { immediate: true },
  )

  watch(openId, (id) => {
    const target = id ? `/${id}` : '/'
    if (route.path !== target) {
      router.replace(target)
    }
  })
}
