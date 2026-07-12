import { DESKTOP_ITEMS } from '@/config/desktop-items'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

/*
 * The whole app is a single desktop. The optional `:windowId` segment deep-links
 * a window open (e.g. /vesper, /about) — useWindowRouter keeps it in sync with
 * the window manager both ways. The segment is constrained to real window ids so
 * any other path falls through to the Blue-Screen-of-Death 404 view.
 */
const WINDOW_IDS = DESKTOP_ITEMS.filter((item) => item.action === 'window').map((item) => item.id)

const routes: RouteRecordRaw[] = [
  {
    path: `/:windowId(${WINDOW_IDS.join('|')})?`,
    name: 'desktop',
    component: () => import('@/views/DesktopView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
