import { ASSISTANTS } from '@/config/assistants'
import { DESKTOP_ITEMS } from '@/config/desktop-items'
import en from '@/locales/en.json'
import type { WindowKind } from '@/types/desktop'
import { describe, expect, it } from 'vitest'

function keyExists(path: string): boolean {
  return (
    path.split('.').reduce<unknown>((node, part) => {
      return node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined
    }, en) !== undefined
  )
}

/*
 * Content lives in en.json so it can be edited without touching code. This test
 * guards the shape the app relies on — a missing key here means a blank window.
 * It is also the safety net for keys the app builds dynamically (window content,
 * icon labels), which typed messages can't check at compile time.
 */
describe('en.json content', () => {
  it('has every icon label and window content key the app derives at runtime', () => {
    for (const item of DESKTOP_ITEMS) {
      expect(keyExists(`icons.${item.id}`)).toBe(true)

      if (item.i18nBase) {
        for (const suffix of ['title', 'meta', 'intro']) {
          expect(keyExists(`${item.i18nBase}.${suffix}`), `${item.i18nBase}.${suffix}`).toBe(true)
        }
      }
    }
  })

  it('exposes the profile identity', () => {
    expect(en.profile.name).toBe('Volodymyr Bondarenko')
    expect(en.profile.location).toBe('Amsterdam, NL')
  })

  it('has a title and stack for every experience role', () => {
    const roles = Object.entries(en.experience).filter(([key]) => key !== 'stackHeading')

    expect(roles.length).toBeGreaterThan(0)
    for (const [, role] of roles) {
      const entry = role as { title: string; stack: string; bullets: string[] }
      expect(entry.title).toBeTruthy()
      expect(entry.stack).toBeTruthy()
      expect(entry.bullets.length).toBeGreaterThan(0)
    }
  })

  it('labels every desktop icon', () => {
    for (const label of Object.values(en.icons)) {
      expect(label).toBeTruthy()
    }
  })

  it('has a line for every assistant reaction the app resolves at runtime', () => {
    const openKinds: WindowKind[] = [
      'about',
      'experience',
      'skills',
      'education',
      'contact',
      'recycle',
      'minesweeper',
      'browser',
    ]

    for (const key of ['greet', 'note', ...openKinds]) {
      expect(keyExists(`assistant.say.${key}`), `assistant.say.${key}`).toBe(true)
    }
  })

  it('has a label for every assistant in the context menu', () => {
    for (const option of ASSISTANTS) {
      expect(keyExists(option.labelKey), option.labelKey).toBe(true)
    }
  })
})
