import type { StickyNote } from '@/types/note'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

/*
 * Thin state container for sticky notes, persisted to localStorage (the XP
 * reference key). Behaviour — spawning, clamping — lives in useNotes.
 */
export const useNotesStore = defineStore('notes', () => {
  const notes = useLocalStorage<StickyNote[]>('xp-notes', [])

  function add(note: StickyNote): void {
    notes.value = [...notes.value, note]
  }

  function patch(id: string, changes: Partial<StickyNote>): void {
    notes.value = notes.value.map((note) => (note.id === id ? { ...note, ...changes } : note))
  }

  function remove(id: string): void {
    notes.value = notes.value.filter((note) => note.id !== id)
  }

  return { notes, add, patch, remove }
})
