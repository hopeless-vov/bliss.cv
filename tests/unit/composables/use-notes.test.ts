import { useNotes } from '@/composables/use-notes'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

function setViewport(w: number, h: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: w })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: h })
  window.dispatchEvent(new Event('resize'))
}

describe('useNotes', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setActivePinia(createPinia())
    setViewport(1200, 800)
  })

  it('spawns a note near the centre, clamped to the desktop', () => {
    const notes = useNotes(() => 0.5)
    notes.createNote()

    expect(notes.notes.value).toHaveLength(1)
    const note = notes.notes.value[0]
    expect(note.x).toBe((1200 - 210) / 2)
    expect(note.y).toBe(800 / 2 - 100)
    expect(note.text).toBe('')
  })

  it('works with the default random source', () => {
    const notes = useNotes()
    notes.createNote()

    const note = notes.notes.value[0]
    expect(note.x).toBeGreaterThanOrEqual(0)
    expect(note.y).toBeGreaterThanOrEqual(0)
  })

  it('edits a note text', () => {
    const notes = useNotes(() => 0.5)
    notes.createNote()
    const id = notes.notes.value[0].id

    notes.setText(id, 'hello')
    expect(notes.notes.value[0].text).toBe('hello')
  })

  it('moves a note with clamping', () => {
    const notes = useNotes(() => 0.5)
    notes.createNote()
    const id = notes.notes.value[0].id

    notes.moveNote(id, 99999, 99999)
    expect(notes.notes.value[0].x).toBe(1200 - 210)
    expect(notes.notes.value[0].y).toBe(800 - 32 - 170)
  })

  it('removes a note', () => {
    const notes = useNotes(() => 0.5)
    notes.createNote()
    const id = notes.notes.value[0].id

    notes.removeNote(id)
    expect(notes.notes.value).toEqual([])
  })
})
