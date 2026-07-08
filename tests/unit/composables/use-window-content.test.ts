import { useWindowContent } from '@/composables/use-window-content'
import { describe, expect, it } from 'vitest'
import { withSetup } from '../test-host'

describe('useWindowContent', () => {
  it('resolves the header block for a base', () => {
    const { header } = withSetup(() => useWindowContent('windows.about'))

    expect(header.value.title).toBe('Volodymyr Bondarenko')
    expect(header.value.meta).toContain('ABOUT')
    expect(header.value.intro.length).toBeGreaterThan(0)
  })

  it('resolves the about block (interests + location)', () => {
    const { about } = withSetup(() => useWindowContent('windows.about'))

    expect(about.value.interestsHeading).toBe('Interests')
    expect(about.value.interests.length).toBeGreaterThan(0)
    expect(about.value.locationHeading).toBe('Location')
    expect(about.value.location).toBe('Amsterdam, NL')
  })

  it('resolves the experience block (stack + bullets)', () => {
    const { experience, bullets } = withSetup(() => useWindowContent('experience.vesper'))

    expect(experience.value.stackHeading).toBe('Stack')
    expect(experience.value.stack).toContain('Vue')
    expect(bullets.value.length).toBeGreaterThan(3)
  })

  it('returns an empty list for a missing key instead of crashing', () => {
    const { bullets } = withSetup(() => useWindowContent('windows.about'))

    expect(bullets.value).toEqual([])
  })

  it('builds the three skill groups', () => {
    const { skillGroups } = withSetup(() => useWindowContent('windows.skills'))

    expect(skillGroups.value).toHaveLength(3)
    expect(skillGroups.value[0].items).toContain('TypeScript')
    expect(skillGroups.value[1].items).toContain('Vue')
    expect(skillGroups.value[2].items).toContain('Docker')
  })

  it('resolves the education block', () => {
    const { education } = withSetup(() => useWindowContent('windows.education'))

    expect(education.value.alsoTaughtHeading).toBe('Also taught')
    expect(education.value.alsoTaught.length).toBeGreaterThan(0)
  })

  it('builds archived groups for the recycle bin', () => {
    const { archivedGroups } = withSetup(() => useWindowContent('windows.recycle'))

    expect(archivedGroups.value).toHaveLength(2)
    expect(archivedGroups.value[0].bullets.length).toBeGreaterThan(0)
  })

  it('builds contact links with working hrefs', () => {
    const { contactLinks } = withSetup(() => useWindowContent('windows.contact'))

    const [email, phone, linkedin] = contactLinks.value
    expect(email.href).toBe('mailto:vov.bndrnk@gmail.com')
    expect(phone.href).toBe('tel:0648613688')
    expect(linkedin.href).toBe('https://linkedin.com/in/vov-bndrnk')
  })
})
