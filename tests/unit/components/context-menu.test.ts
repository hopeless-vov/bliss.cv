import ContextMenu from '@/components/ContextMenu.vue'
import { useSettingsStore } from '@/stores/settings'
import { describe, expect, it } from 'vitest'
import { mountApp } from '../mount-app'

describe('ContextMenu', () => {
  it('lists the menu actions', () => {
    const wrapper = mountApp(ContextMenu, { props: { x: 10, y: 10 } })

    expect(wrapper.text()).toContain('New Note')
    expect(wrapper.text()).toContain('Arrange Icons')
    expect(wrapper.text()).toContain('Cursor')
    expect(wrapper.text()).toContain('Wallpaper')
    expect(wrapper.text()).not.toContain('CRT')
  })

  it('changes the cursor and closes when a cursor option is picked', async () => {
    const wrapper = mountApp(ContextMenu, { props: { x: 10, y: 10 } })
    const settings = useSettingsStore()

    const crosshair = wrapper.findAll('button').find((b) => b.text() === 'Crosshair')
    await crosshair?.trigger('click')

    expect(settings.cursor).toBe('crosshair')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('changes the wallpaper when a wallpaper option is picked', async () => {
    const wrapper = mountApp(ContextMenu, { props: { x: 10, y: 10 } })
    const settings = useSettingsStore()

    const night = wrapper.findAll('button').find((b) => b.text() === 'Night Sky')
    await night?.trigger('click')

    expect(settings.wallpaper).toBe('night')
  })
})
