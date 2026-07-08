import StartMenu from '@/components/StartMenu.vue'
import { useWindowsStore } from '@/stores/windows'
import { describe, expect, it } from 'vitest'
import { mountApp } from '../mount-app'

describe('StartMenu', () => {
  it('renders the five experience files and five fixed items', () => {
    const wrapper = mountApp(StartMenu)

    expect(wrapper.text()).toContain('Vesper.exe')
    expect(wrapper.text()).toContain('About Me')
    expect(wrapper.text()).toContain('Turn Off Computer')
  })

  it('opens the matching window when an item is clicked', async () => {
    const wrapper = mountApp(StartMenu)
    const windows = useWindowsStore()

    const aboutButton = wrapper.findAll('button').find((b) => b.text() === 'About Me')
    await aboutButton?.trigger('click')

    expect(windows.openId).toBe('about')
  })
})
