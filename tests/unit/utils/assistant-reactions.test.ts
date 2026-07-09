import type { WindowKind } from '@/types/desktop'
import { reactionFor } from '@/utils/assistant-reactions'
import { describe, expect, it } from 'vitest'

describe('reactionFor', () => {
  it('greets with a Greeting animation', () => {
    expect(reactionFor({ type: 'greet' })).toEqual({
      animation: 'Greeting',
      sayKey: 'assistant.say.greet',
    })
  })

  it('reacts to a new note with a Writing animation', () => {
    expect(reactionFor({ type: 'note' })).toEqual({
      animation: 'Writing',
      sayKey: 'assistant.say.note',
    })
  })

  it('maps every window kind to its own open reaction', () => {
    const kinds: WindowKind[] = [
      'about',
      'experience',
      'skills',
      'education',
      'contact',
      'recycle',
    ]

    for (const kind of kinds) {
      const reaction = reactionFor({ type: 'open', kind })
      expect(reaction.animation).toBeTruthy()
      expect(reaction.sayKey).toBe(`assistant.say.${kind}`)
    }
  })

  it('picks distinct animations per kind', () => {
    expect(reactionFor({ type: 'open', kind: 'about' }).animation).toBe('Wave')
    expect(reactionFor({ type: 'open', kind: 'skills' }).animation).toBe('Thinking')
    expect(reactionFor({ type: 'open', kind: 'contact' }).animation).toBe('GetAttention')
  })
})
