import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

/*
 * The whole app is a single desktop. The optional `:windowId` segment deep-links
 * a window open (e.g. /vesper, /about) — useWindowRouter keeps it in sync with
 * the window manager both ways. Everything else stays client-side state.
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/:windowId?',
    name: 'desktop',
    component: () => import('@/views/DesktopView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
