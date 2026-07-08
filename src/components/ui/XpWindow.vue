<script setup lang="ts">
import XpTitleBar from '@/components/ui/XpTitleBar.vue'

withDefaults(
  defineProps<{
    title: string
    active?: boolean
    maximized?: boolean
    menu?: string[]
  }>(),
  { active: true, maximized: false, menu: () => [] },
)

defineEmits<{
  minimize: []
  maximize: []
  close: []
  titlebarPointerDown: [event: PointerEvent]
  titlebarDblclick: []
}>()
</script>

<template>
  <div
    data-testid="xp-window"
    class="xp-window-shadow flex flex-col overflow-hidden border border-window-border bg-window"
    :class="maximized ? 'rounded-none' : 'rounded-t-lg'"
  >
    <XpTitleBar
      :title="title"
      :active="active"
      @minimize="$emit('minimize')"
      @maximize="$emit('maximize')"
      @close="$emit('close')"
      @titlebar-pointer-down="$emit('titlebarPointerDown', $event)"
      @titlebar-dblclick="$emit('titlebarDblclick')"
    >
      <template #icon>
        <slot name="icon" />
      </template>
    </XpTitleBar>

    <nav
      v-if="menu.length"
      class="flex items-center gap-1 border-b border-white bg-window px-1 py-0.75 text-xs text-ink"
    >
      <button
        v-for="item in menu"
        :key="item"
        type="button"
        class="rounded-xs px-2 py-px hover:bg-highlight hover:text-white"
      >
        {{ item }}
      </button>
    </nav>

    <div
      class="m-0.75 mt-0 flex-1 overflow-y-auto border border-content-border bg-field select-text"
    >
      <slot />
    </div>
  </div>
</template>
