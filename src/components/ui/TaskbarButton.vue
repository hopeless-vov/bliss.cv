<script setup lang="ts">
withDefaults(defineProps<{ label: string; active?: boolean }>(), { active: false })
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
    <span class="h-3 w-3 shrink-0 rounded-xs bg-white/90" />
    <span class="truncate">{{ label }}</span>
  </button>
</template>
