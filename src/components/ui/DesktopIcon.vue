<script setup lang="ts">
import XpIcon from '@/components/ui/XpIcon.vue'
import type { XpIconName } from '@/types/desktop'

withDefaults(defineProps<{ label: string; icon: XpIconName; selected?: boolean }>(), {
  selected: false,
})

defineEmits<{ select: []; open: [] }>()
</script>

<template>
  <button
    type="button"
    class="flex w-20.5 flex-col items-center gap-1 rounded-xs border p-1 text-center"
    :class="selected ? 'border-dotted border-white/60 bg-icon-select/35' : 'border-transparent'"
    @click="$emit('select')"
    @dblclick="$emit('open')"
    @keydown.enter.prevent="$emit('open')"
  >
    <XpIcon
      :name="icon"
      class="xp-icon-shadow h-10 w-10"
    />
    <span
      class="xp-icon-label max-w-full text-xs leading-tight wrap-break-word text-white"
      :class="selected ? 'bg-icon-select' : ''"
    >
      {{ label }}
    </span>
  </button>
</template>
