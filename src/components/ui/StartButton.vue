<script setup lang="ts">
import WindowsFlagIcon from '@/assets/icons/windows-flag.svg?component'

defineProps<{ label: string }>()
defineEmits<{ click: [] }>()
</script>

<template>
  <button
    type="button"
    class="xp-start-btn flex h-full shrink-0 items-center gap-1 rounded-r-xl pr-4 pl-2 select-none"
    @click="$emit('click')"
  >
    <WindowsFlagIcon class="h-4 w-4" />
    <span class="xp-title-shadow text-[15px] font-bold text-white italic">{{ label }}</span>
  </button>
</template>
