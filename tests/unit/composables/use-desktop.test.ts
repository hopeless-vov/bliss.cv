import { useDesktop } from '@/composables/use-desktop'
import { useWindowsStore } from '@/stores/windows'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('useDesktop', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setActivePinia(createPinia())
  })

  it('selects and clears icons', () => {
    const desktop = useDesktop()

    desktop.select('about')
    expect(desktop.selectedId.value).toBe('about')

    desktop.clearSelection()
    expect(desktop.selectedId.value).toBe(null)
  })

  it('activating a window item opens its window and selects it', () => {
    const desktop = useDesktop()
    const windows = useWindowsStore()

    desktop.activate({ id: 'skills', icon: 'notepad', action: 'window', kind: 'skills' })

    expect(windows.windows.map((win) => win.id)).toContain('skills')
    expect(desktop.selectedId.value).toBe('skills')
  })

  it('activating the pdf item opens it in a new tab', () => {
    const desktop = useDesktop()
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null)

    desktop.activate({ id: 'resume', icon: 'pdf', action: 'pdf', href: '/CV.pdf' })

    expect(openSpy).toHaveBeenCalledWith('/CV.pdf', '_blank', 'noopener')
    openSpy.mockRestore()
  })

  it('ignores a pdf item without an href', () => {
    const desktop = useDesktop()
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null)

    desktop.activate({ id: 'resume', icon: 'pdf', action: 'pdf' })

    expect(openSpy).not.toHaveBeenCalled()
    openSpy.mockRestore()
  })

  it('activating the note item spawns a sticky note', () => {
    const desktop = useDesktop()

    desktop.activate({ id: 'newNote', icon: 'note', action: 'note' })

    // The note lands in the store synchronously (remote sync is fire-and-forget).
    expect(desktop.selectedId.value).toBe('newNote')
  })

  it('shares selection across independent composable calls', () => {
    const first = useDesktop()
    const second = useDesktop()

    first.select('skills')

    expect(second.selectedId.value).toBe('skills')
  })

  it('activateById resolves items and ignores unknown ids', () => {
    const desktop = useDesktop()
    const windows = useWindowsStore()

    desktop.activateById('about')
    expect(windows.windows.map((win) => win.id)).toEqual(['about'])

    desktop.activateById('nope')
    expect(windows.windows.map((win) => win.id)).toEqual(['about'])
  })
})
