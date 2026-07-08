import { useNotesStore } from '@/stores/notes'
import type { StickyNote } from '@/types/note'
import { clampNotePosition, NOTE_WIDTH } from '@/utils/clamp-window'
import { generateId } from '@/utils/generate-id'
import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

/*
 * Sticky notes — a local scratchpad. Spawn near the centre with a little jitter,
 * edit, drag (clamped to the desktop), delete. State is persisted to
 * localStorage by the store; there is no backend.
 */
export function useNotes(random: () => number = Math.random) {
  const store = useNotesStore()
  const { width, height } = useWindowSize()

  const notes = computed(() => store.notes)

  function createNote(): void {
    const jitter = () => (random() - 0.5) * 60
    const spawn = clampNotePosition(
      (width.value - NOTE_WIDTH) / 2 + jitter(),
      height.value / 2 - 100 + jitter(),
      width.value,
      height.value,
    )

    const note: StickyNote = {
      id: generateId(random),
      x: spawn.x,
      y: spawn.y,
      text: '',
      createdAt: new Date().toISOString(),
    }
    store.add(note)
  }

  function setText(id: string, text: string): void {
    store.patch(id, { text })
  }

  function moveNote(id: string, x: number, y: number): void {
    store.patch(id, clampNotePosition(x, y, width.value, height.value))
  }

  function removeNote(id: string): void {
    store.remove(id)
  }

  return { notes, createNote, setText, moveNote, removeNote }
}
