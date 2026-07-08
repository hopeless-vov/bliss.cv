<script setup lang="ts">
defineProps<{ time: string }>()
</script>

<template>
  <div
    class="xp-tray flex h-6 shrink-0 items-center rounded-xs px-3 text-xs text-white select-none"
  >
    {{ time }}
  </div>
</template>
