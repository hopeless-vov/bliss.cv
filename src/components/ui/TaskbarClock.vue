<script setup lang="ts">
defineProps<{ time: string }>()
</script>

<template>
  <div
    class="xp-tray flex h-full shrink-0 items-center border-l border-luna-blue-light/50 px-4 text-xs text-white select-none"
  >
    {{ time }}
  </div>
</template>
