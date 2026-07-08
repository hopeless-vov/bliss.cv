import DesktopWindow from '@/components/DesktopWindow.vue'
import { useWindowsStore } from '@/stores/windows'
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

  it('renders a labelled dialog for the open window', async () => {
    const wrapper = mountApp(DesktopWindow)
    useWindowsStore().setOpen('vesper')
    await nextTick()

    const dialog = wrapper.get('[role="dialog"]')
    expect(dialog.attributes('aria-modal')).toBe('true')
    expect(dialog.attributes('aria-label')).toBe('Vesper')
    expect(wrapper.get('h1').text()).toBe('Vesper')
  })

  it('hides again when the window is closed', async () => {
    const wrapper = mountApp(DesktopWindow)
    const windows = useWindowsStore()

    windows.setOpen('about')
    await nextTick()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

    windows.reset()
    await nextTick()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })
})
