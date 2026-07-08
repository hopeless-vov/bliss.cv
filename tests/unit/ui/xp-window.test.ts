import XpWindow from '@/components/ui/XpWindow.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('XpWindow', () => {
  it('renders the title, menu items and slotted content', () => {
    const wrapper = mount(XpWindow, {
      props: { title: 'C:\\Portfolio\\About', menu: ['File', 'Edit'] },
      slots: { default: '<p>hello content</p>' },
    })

    expect(wrapper.text()).toContain('C:\\Portfolio\\About')
    expect(wrapper.text()).toContain('File')
    expect(wrapper.text()).toContain('Edit')
    expect(wrapper.html()).toContain('hello content')
  })

  it('omits the menubar when no menu is given', () => {
    const wrapper = mount(XpWindow, { props: { title: 'x' } })
    expect(wrapper.find('nav').exists()).toBe(false)
  })

  it('drops the top radius when maximized', () => {
    const wrapper = mount(XpWindow, { props: { title: 'x', maximized: true } })
    expect(wrapper.classes()).toContain('rounded-none')
  })

  it('emits close from the title-bar close button', async () => {
    const wrapper = mount(XpWindow, { props: { title: 'x' } })
    const buttons = wrapper.findAll('button')

    await buttons[buttons.length - 1].trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
