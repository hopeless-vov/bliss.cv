<script setup lang="ts">
import StickyNote from '@/components/ui/StickyNote.vue'
import { useNotes } from '@/composables/use-notes'
import { usePointerDrag } from '@/composables/use-pointer-drag'
import { formatNoteDate } from '@/utils/format-note-date'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { notes, setText, moveNote, removeNote } = useNotes()

const { start } = usePointerDrag<string>((x, y, id) => moveNote(id, x, y))
</script>

<template>
  <div
    v-for="note in notes"
    :key="note.id"
    class="absolute z-notes"
    :style="{ left: `${note.x}px`, top: `${note.y}px` }"
  >
    <StickyNote
      :text="note.text"
      :date="formatNoteDate(note.createdAt)"
      :placeholder="t('note.placeholder')"
      @drag-start="start($event, { x: note.x, y: note.y }, note.id)"
      @update-text="setText(note.id, $event)"
      @remove="removeNote(note.id)"
    />
  </div>
</template>
