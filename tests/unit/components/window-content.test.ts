import WindowContent from '@/components/WindowContent.vue'
import { describe, expect, it } from 'vitest'
import { mountApp } from '../mount-app'

describe('WindowContent', () => {
  it('renders the about layout (interests + location)', () => {
    const wrapper = mountApp(WindowContent, { props: { kind: 'about', base: 'windows.about' } })

    expect(wrapper.get('h1').text()).toBe('Volodymyr Bondarenko')
    expect(wrapper.text()).toContain('Interests')
    expect(wrapper.text()).toContain('Amsterdam, NL')
  })

  it('renders the experience layout (stack + bullets)', () => {
    const wrapper = mountApp(WindowContent, {
      props: { kind: 'experience', base: 'experience.vesper' },
    })

    expect(wrapper.get('h1').text()).toBe('Vesper')
    expect(wrapper.text()).toContain('Stack')
    expect(wrapper.findAll('li').length).toBeGreaterThan(3)
  })

  it('renders the skills layout as three chip groups', () => {
    const wrapper = mountApp(WindowContent, { props: { kind: 'skills', base: 'windows.skills' } })

    expect(wrapper.findAll('h2')).toHaveLength(3)
    expect(wrapper.text()).toContain('TypeScript')
  })

  it('renders contact links with mailto/tel/https hrefs', () => {
    const wrapper = mountApp(WindowContent, { props: { kind: 'contact', base: 'windows.contact' } })
    const hrefs = wrapper.findAll('a').map((a) => a.attributes('href'))

    expect(hrefs).toContain('mailto:vov.bndrnk@gmail.com')
    expect(hrefs.some((h) => h?.startsWith('tel:'))).toBe(true)
  })
})
