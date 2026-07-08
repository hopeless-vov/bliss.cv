import { useStartMenuItems } from '@/composables/use-start-menu-items'
import { describe, expect, it } from 'vitest'
import { withSetup } from '../test-host'

describe('useStartMenuItems', () => {
  it('builds the left column from experience items with ext badges', () => {
    const { leftItems } = withSetup(() => useStartMenuItems())

    expect(leftItems.value).toHaveLength(5)
    const vesper = leftItems.value[0]
    expect(vesper.id).toBe('vesper')
    expect(vesper.label).toBe('Vesper.exe')
    expect(vesper.ext).toBe('EXE')
    expect(vesper.badgeClass).toContain('bg-badge-exe')
  })

  it('assigns the right badge class per extension', () => {
    const { leftItems } = withSetup(() => useStartMenuItems())
    const byId = Object.fromEntries(leftItems.value.map((item) => [item.id, item.badgeClass]))

    expect(byId.worth).toContain('bg-badge-doc')
    expect(byId.frozeneon).toContain('bg-badge-vue')
    expect(byId.quinta).toContain('bg-badge-js')
    expect(byId.surelock).toContain('bg-badge-zip')
  })

  it('builds the fixed right column', () => {
    const { rightItems } = withSetup(() => useStartMenuItems())

    expect(rightItems.value.map((item) => item.id)).toEqual([
      'about',
      'skills',
      'education',
      'resume',
      'contact',
    ])
    expect(rightItems.value[0].label).toBe('About Me')
  })
})
