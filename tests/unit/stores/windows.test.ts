import { useWindowsStore } from '@/stores/windows'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

describe('windows store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds windows with a compact 1..n stacking rank', () => {
    const store = useWindowsStore()

    store.add('about', { x: 1, y: 2 })
    store.add('skills', { x: 3, y: 4 })

    expect(store.windows).toHaveLength(2)
    expect(store.windows[0]).toMatchObject({
      id: 'about',
      minimized: false,
      maximized: false,
      z: 1,
    })
    expect(store.windows[1]).toMatchObject({ id: 'skills', position: { x: 3, y: 4 }, z: 2 })
  })

  it('removes a window and re-closes the rank gap', () => {
    const store = useWindowsStore()
    store.add('about', { x: 0, y: 0 })
    store.add('skills', { x: 0, y: 0 })
    store.add('contact', { x: 0, y: 0 })

    store.remove('skills')

    expect(store.windows.map((win) => win.id)).toEqual(['about', 'contact'])
    // contact was z:3, drops to z:2 to keep the ranks compact.
    expect(store.windows.map((win) => win.z)).toEqual([1, 2])
  })

  it('ignores removing an unknown id', () => {
    const store = useWindowsStore()
    store.add('about', { x: 0, y: 0 })

    store.remove('missing')

    expect(store.windows.map((win) => win.id)).toEqual(['about'])
  })

  it('patches an existing window and ignores unknown ids', () => {
    const store = useWindowsStore()
    store.add('about', { x: 0, y: 0 })

    store.patch('about', { minimized: true, maximized: true, position: { x: 9, y: 9 } })
    store.patch('missing', { minimized: true })

    expect(store.windows[0]).toMatchObject({
      minimized: true,
      maximized: true,
      position: { x: 9, y: 9 },
    })
  })

  it('focus raises a window to the top, keeps ranks compact, and no-ops on top/unknown', () => {
    const store = useWindowsStore()
    store.add('about', { x: 0, y: 0 })
    store.add('skills', { x: 0, y: 0 })
    store.add('contact', { x: 0, y: 0 })

    const z = (id: string) => store.windows.find((win) => win.id === id)?.z

    store.focus('about')
    // about jumps to the top (3); skills and contact slide down to fill the gap.
    expect([z('about'), z('skills'), z('contact')]).toEqual([3, 1, 2])

    // Focusing the already-top window and an unknown id are both no-ops.
    store.focus('about')
    store.focus('missing')
    expect([z('about'), z('skills'), z('contact')]).toEqual([3, 1, 2])
  })
})
