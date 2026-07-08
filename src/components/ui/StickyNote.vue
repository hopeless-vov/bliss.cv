<script setup lang="ts">
import CloseIcon from '@/assets/icons/close.svg?component'

defineProps<{ text: string; date: string; placeholder: string }>()

defineEmits<{
  dragStart: [event: PointerEvent]
  updateText: [text: string]
  remove: []
}>()
</script>

<template>
  <div
    class="xp-window-shadow flex w-52.5 flex-col overflow-hidden rounded-xs border border-note-border bg-note"
  >
    <div
      class="xp-note-header flex cursor-move items-center justify-between px-2 py-1"
      @pointerdown="$emit('dragStart', $event)"
    >
      <span class="text-[10px] font-bold text-note-title">{{ date }}</span>
      <button
        type="button"
        aria-label="Delete note"
        class="grid h-3.5 w-3.5 place-items-center rounded-xs text-note-title hover:bg-black/10"
        @click="$emit('remove')"
      >
        <CloseIcon class="h-2 w-2" />
      </button>
    </div>

    <textarea
      :value="text"
      :placeholder="placeholder"
      rows="4"
      class="w-full resize-none bg-transparent px-2 py-1.5 text-xs leading-normal text-note-text outline-none placeholder:text-note-title/60"
      @input="$emit('updateText', ($event.target as HTMLTextAreaElement).value)"
    />
  </div>
</template>
