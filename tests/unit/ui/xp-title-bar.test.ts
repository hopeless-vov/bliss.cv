import XpTitleBar from '@/components/ui/XpTitleBar.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('XpTitleBar', () => {
  it('renders the title', () => {
    const wrapper = mount(XpTitleBar, { props: { title: 'C:\\Portfolio\\About' } })
    expect(wrapper.text()).toContain('C:\\Portfolio\\About')
  })

  it('uses the active gradient by default and the inactive one when inactive', async () => {
    const wrapper = mount(XpTitleBar, { props: { title: 'x' } })
    expect(wrapper.classes()).toContain('xp-titlebar-active')

    await wrapper.setProps({ active: false })
    expect(wrapper.classes()).toContain('xp-titlebar-inactive')
  })

  it('re-emits drag pointerdown, double-click and control events', async () => {
    const wrapper = mount(XpTitleBar, { props: { title: 'x' } })

    await wrapper.trigger('pointerdown')
    await wrapper.trigger('dblclick')
    await wrapper.findAll('button')[2].trigger('click')

    expect(wrapper.emitted('titlebarPointerDown')).toHaveLength(1)
    expect(wrapper.emitted('titlebarDblclick')).toHaveLength(1)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
