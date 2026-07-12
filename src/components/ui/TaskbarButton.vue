<script setup lang="ts">
import XpIcon from '@/components/ui/XpIcon.vue'
import type { XpIconName } from '@/types/desktop'

withDefaults(defineProps<{ label: string; icon: XpIconName; active?: boolean }>(), {
  active: false,
})
defineEmits<{ click: [] }>()
</script>

<template>
  <button
    type="button"
    data-testid="taskbar-window-button"
    class="flex h-6 min-w-0 max-w-55 flex-1 items-center gap-2 rounded-xs border border-luna-blue-dark px-2 text-xs text-white select-none"
    :class="active ? 'xp-taskbar-btn-active' : 'xp-taskbar-btn'"
    @click="$emit('click')"
  >
    <XpIcon
      :name="icon"
      class="h-4 w-4 shrink-0"
    />
    <span class="truncate">{{ label }}</span>
  </button>
</template>
