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

  it('opens the window from a deep link', async () => {
    await mountAt('/vesper')
    const wm = useWindowManager()

    expect(wm.openId.value).toBe('vesper')
  })

  it('leaves an already-open window untouched', async () => {
    const wm = useWindowManager()
    wm.open('about')
    const position = { ...wm.position.value }

    await mountAt('/about')

    expect(wm.openId.value).toBe('about')
    expect(wm.position.value).toEqual(position)
  })

  it('rewrites the URL when a window opens and closes', async () => {
    const router = await mountAt('/')
    const wm = useWindowManager()

    wm.open('skills')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/skills')

    wm.close()
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('closes the window when navigating back to /', async () => {
    const router = await mountAt('/education')
    const wm = useWindowManager()
    expect(wm.isOpen.value).toBe(true)

    await router.push('/')
    await flushPromises()

    expect(wm.isOpen.value).toBe(false)
  })

  it('redirects non-window ids to /', async () => {
    const router = await mountAt('/resume')
    const wm = useWindowManager()

    expect(wm.openId.value).toBe(null)
    expect(router.currentRoute.value.path).toBe('/')
  })
})
