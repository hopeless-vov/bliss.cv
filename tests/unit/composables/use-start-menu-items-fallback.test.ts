import { useStartMenuItems } from '@/composables/use-start-menu-items'
import { describe, expect, it, vi } from 'vitest'
import { withSetup } from '../test-host'

/*
 * Covers the defensive badge fallback: an experience item whose label has no
 * (or an unknown) extension still gets a styled badge.
 */
vi.mock('@/config/desktop-items', () => ({
  DESKTOP_ITEMS: [
    { id: 'recycle', icon: 'bin', action: 'window', kind: 'experience', i18nBase: 'x' },
  ],
}))

describe('useStartMenuItems badge fallback', () => {
  it('uses the default badge class when the label has no known extension', () => {
    const { leftItems } = withSetup(() => useStartMenuItems())

    expect(leftItems.value).toHaveLength(1)
    expect(leftItems.value[0].ext).toBe(null)
    expect(leftItems.value[0].badgeClass).toBe('bg-badge-exe text-white')
  })
})
