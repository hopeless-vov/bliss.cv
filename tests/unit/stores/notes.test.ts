import { useNotesStore } from '@/stores/notes'
import type { StickyNote } from '@/types/note'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

function makeNote(id: string): StickyNote {
  return {
    id,
    x: 10,
    y: 20,
    text: '',
    createdAt: new Date(2026, 0, 1).toISOString(),
  }
}

describe('notes store', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setActivePinia(createPinia())
  })

  it('adds notes', () => {
    const store = useNotesStore()
    store.add(makeNote('a'))
    store.add(makeNote('b'))

    expect(store.notes.map((note) => note.id)).toEqual(['a', 'b'])
  })

  it('patches only the matching note', () => {
    const store = useNotesStore()
    store.add(makeNote('a'))
    store.add(makeNote('b'))

    store.patch('a', { text: 'hello' })

    expect(store.notes[0].text).toBe('hello')
    expect(store.notes[1].text).toBe('')
  })

  it('removes a note', () => {
    const store = useNotesStore()
    store.add(makeNote('a'))
    store.remove('a')

    expect(store.notes).toEqual([])
  })

  it('persists notes to localStorage under the XP key', async () => {
    const store = useNotesStore()
    store.add(makeNote('a'))
    await nextTick()

    expect(JSON.parse(window.localStorage.getItem('xp-notes') ?? '[]')).toHaveLength(1)
  })
})
