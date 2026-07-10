import { useWindowManager } from '@/composables/use-window-manager'
import { useWindowRouter } from '@/composables/use-window-router'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import type { Router } from 'vue-router'
import { createMemoryHistory, createRouter } from 'vue-router'

const HostComponent = defineComponent({
  setup() {
    useWindowRouter()
    return () => h('div')
  },
})

function makeRouter(): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:windowId?', name: 'desktop', component: HostComponent }],
  })
}

async function mountAt(path: string) {
  const router = makeRouter()
  await router.push(path)
  await router.isReady()
  mount(HostComponent, { global: { plugins: [router] } })
  await flushPromises()
  return router
}

describe('useWindowRouter', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('opens the focused window from a deep link', async () => {
    await mountAt('/vesper')
    const wm = useWindowManager()

    expect(wm.focusedId.value).toBe('vesper')
  })

  it('leaves an already-focused window untouched', async () => {
    const wm = useWindowManager()
    wm.open('about')
    const position = { ...wm.windows.value[0].position }

    await mountAt('/about')

    expect(wm.windows.value).toHaveLength(1)
    expect(wm.windows.value[0].position).toEqual(position)
  })

  it('rewrites the URL as the focused window opens and closes', async () => {
    const router = await mountAt('/')
    const wm = useWindowManager()

    wm.open('skills')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/skills')

    wm.close('skills')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('follows focus to the next window when the focused one closes', async () => {
    const router = await mountAt('/')
    const wm = useWindowManager()

    wm.open('about')
    wm.open('skills')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/skills')

    wm.close('skills')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/about')
  })

  it('opens a second window from a deep link without closing the first', async () => {
    const router = await mountAt('/')
    const wm = useWindowManager()
    wm.open('about')
    await flushPromises()

    await router.push('/skills')
    await flushPromises()

    expect(wm.windows.value.map((win) => win.id)).toEqual(['about', 'skills'])
    expect(wm.focusedId.value).toBe('skills')
  })

  it('redirects a non-window id to /', async () => {
    const router = await mountAt('/resume')
    const wm = useWindowManager()

    expect(wm.focusedId.value).toBe(null)
    expect(router.currentRoute.value.path).toBe('/')
  })
})
