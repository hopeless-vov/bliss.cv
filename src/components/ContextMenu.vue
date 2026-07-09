<script setup lang="ts">
import ChevronRightIcon from '@/assets/icons/chevron-right.svg?component'
import { useAssistant } from '@/composables/use-assistant'
import { useDesktop } from '@/composables/use-desktop'
import { useDynamicText } from '@/composables/use-dynamic-text'
import { useIconPositions } from '@/composables/use-icon-positions'
import { useNotes } from '@/composables/use-notes'
import { useSettings } from '@/composables/use-settings'
import type { AssistantName } from '@/config/assistants'
import { ASSISTANTS } from '@/config/assistants'
import type { CursorId } from '@/config/cursors'
import { CURSORS } from '@/config/cursors'
import type { WallpaperId } from '@/config/wallpapers'
import { WALLPAPERS } from '@/config/wallpapers'
import { useI18n } from 'vue-i18n'

defineProps<{ x: number; y: number }>()
const emit = defineEmits<{ close: [] }>()

const { t } = useI18n()
const td = useDynamicText()
const { createNote } = useNotes()
const { activateById } = useDesktop()
const { arrangeIcons } = useIconPositions()
const { wallpaper, cursor, setWallpaper, setCursor } = useSettings()
const {
  enabled: assistantEnabled,
  name: assistantName,
  disable: disableAssistant,
  setAgent: setAssistant,
} = useAssistant()

function onNewNote(): void {
  createNote()
  emit('close')
}

function onArrangeIcons(): void {
  arrangeIcons()
  emit('close')
}

function onCursor(id: CursorId): void {
  setCursor(id)
  emit('close')
}

function onWallpaper(id: WallpaperId): void {
  setWallpaper(id)
  emit('close')
}

function onProperties(): void {
  activateById('about')
  emit('close')
}

function onAssistantOff(): void {
  disableAssistant()
  emit('close')
}

function onAssistantPick(name: AssistantName): void {
  void setAssistant(name)
  emit('close')
}
</script>

<template>
  <nav
    class="xp-window-shadow absolute z-context-menu w-50 rounded-xs border border-content-border bg-field py-1 text-xs text-ink select-none"
    :style="{ left: `${x}px`, top: `${y}px` }"
  >
    <button
      type="button"
      class="block w-full px-4 py-1.25 text-left hover:bg-highlight hover:text-white"
      @click="onNewNote"
    >
      {{ t('context.newNote') }}
    </button>

    <button
      type="button"
      class="block w-full px-4 py-1.25 text-left hover:bg-highlight hover:text-white"
      @click="onArrangeIcons"
    >
      {{ t('context.arrangeIcons') }}
    </button>

    <div class="mx-1 my-1 border-t border-content-border" />

    <div class="group relative">
      <button
        type="button"
        class="flex w-full items-center justify-between px-4 py-1.25 text-left group-hover:bg-highlight group-hover:text-white"
      >
        {{ t('context.cursor') }}
        <ChevronRightIcon class="h-2 w-1.25" />
      </button>
      <div
        class="xp-window-shadow absolute top-0 left-full hidden w-37.5 rounded-xs border border-content-border bg-field py-1 group-hover:block"
      >
        <button
          v-for="option in CURSORS"
          :key="option.id"
          type="button"
          class="flex w-full items-center gap-2 px-3 py-1.25 text-left hover:bg-highlight hover:text-white"
          @click="onCursor(option.id)"
        >
          <span class="grid w-2 place-items-center">
            <span
              v-if="cursor === option.id"
              class="h-1.25 w-1.25 rounded-full bg-current"
            />
          </span>
          {{ td(option.labelKey) }}
        </button>
      </div>
    </div>

    <div class="group relative">
      <button
        type="button"
        class="flex w-full items-center justify-between px-4 py-1.25 text-left group-hover:bg-highlight group-hover:text-white"
      >
        {{ t('context.wallpaper') }}
        <ChevronRightIcon class="h-2 w-1.25" />
      </button>
      <div
        class="xp-window-shadow absolute top-0 left-full hidden w-37.5 rounded-xs border border-content-border bg-field py-1 group-hover:block"
      >
        <button
          v-for="option in WALLPAPERS"
          :key="option.id"
          type="button"
          class="flex w-full items-center gap-2 px-3 py-1.25 text-left hover:bg-highlight hover:text-white"
          @click="onWallpaper(option.id)"
        >
          <span class="grid w-2 place-items-center">
            <span
              v-if="wallpaper === option.id"
              class="h-1.25 w-1.25 rounded-full bg-current"
            />
          </span>
          {{ td(option.labelKey) }}
        </button>
      </div>
    </div>

    <div class="group relative">
      <button
        type="button"
        class="flex w-full items-center justify-between px-4 py-1.25 text-left group-hover:bg-highlight group-hover:text-white"
      >
        {{ t('context.assistant') }}
        <ChevronRightIcon class="h-2 w-1.25" />
      </button>
      <div
        class="xp-window-shadow absolute top-0 left-full hidden max-h-64 w-37.5 overflow-y-auto rounded-xs border border-content-border bg-field py-1 group-hover:block"
      >
        <button
          type="button"
          class="flex w-full items-center gap-2 px-3 py-1.25 text-left hover:bg-highlight hover:text-white"
          @click="onAssistantOff"
        >
          <span class="grid w-2 place-items-center">
            <span
              v-if="!assistantEnabled"
              class="h-1.25 w-1.25 rounded-full bg-current"
            />
          </span>
          {{ t('context.assistantOff') }}
        </button>
        <button
          v-for="option in ASSISTANTS"
          :key="option.name"
          type="button"
          class="flex w-full items-center gap-2 px-3 py-1.25 text-left hover:bg-highlight hover:text-white"
          @click="onAssistantPick(option.name)"
        >
          <span class="grid w-2 place-items-center">
            <span
              v-if="assistantEnabled && assistantName === option.name"
              class="h-1.25 w-1.25 rounded-full bg-current"
            />
          </span>
          {{ td(option.labelKey) }}
        </button>
      </div>
    </div>

    <div class="mx-1 my-1 border-t border-content-border" />

    <button
      type="button"
      class="block w-full px-4 py-1.25 text-left hover:bg-highlight hover:text-white"
      @click="onProperties"
    >
      {{ t('context.properties') }}
    </button>
  </nav>
</template>
