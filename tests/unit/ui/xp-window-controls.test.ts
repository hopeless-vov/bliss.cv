import XpWindowControls from '@/components/ui/XpWindowControls.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('XpWindowControls', () => {
  it('emits minimize, maximize and close from their buttons', async () => {
    const wrapper = mount(XpWindowControls)
    const [min, max, close] = wrapper.findAll('button')

    await min.trigger('click')
    await max.trigger('click')
    await close.trigger('click')

    expect(wrapper.emitted('minimize')).toHaveLength(1)
    expect(wrapper.emitted('maximize')).toHaveLength(1)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
