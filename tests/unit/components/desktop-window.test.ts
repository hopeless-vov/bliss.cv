import DesktopWindow from '@/components/DesktopWindow.vue'
import { useWindowManager } from '@/composables/use-window-manager'
import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mountApp } from '../mount-app'

beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 })
})

describe('DesktopWindow', () => {
  it('renders nothing when no window is open', () => {
    const wrapper = mountApp(DesktopWindow)

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('renders a labelled, non-modal dialog for each open window', async () => {
    const wrapper = mountApp(DesktopWindow)
    const wm = useWindowManager()
    wm.open('vesper')
    wm.open('skills')
    await nextTick()

    const dialogs = wrapper.findAll('[role="dialog"]')
    expect(dialogs).toHaveLength(2)
    // Windows coexist now, so none of them claim modality.
    expect(dialogs[0].attributes('aria-modal')).toBeUndefined()
    expect(dialogs.map((dialog) => dialog.attributes('aria-label'))).toEqual(['Vesper', 'Skills'])
  })

  it('drops a window from the DOM when it is minimized', async () => {
    const wrapper = mountApp(DesktopWindow)
    const wm = useWindowManager()

    wm.open('about')
    await nextTick()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

    wm.minimize('about')
    await nextTick()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('stacks the focused window above the others', async () => {
    const wrapper = mountApp(DesktopWindow)
    const wm = useWindowManager()
    wm.open('about')
    wm.open('skills')
    await nextTick()

    // DOM order is stable insertion order (about, then skills); stacking is
    // driven by the `--stack` rank, and skills was focused last so it's on top.
    const [about, skills] = wrapper
      .findAll('[role="dialog"]')
      .map((node) => Number((node.element as HTMLElement).style.getPropertyValue('--stack')))

    expect(skills).toBeGreaterThan(about)
  })
})
