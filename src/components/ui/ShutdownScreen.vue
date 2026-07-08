<script setup lang="ts">
defineProps<{ message: string; hint: string }>()
defineEmits<{ powerOn: [] }>()
</script>

<template>
  <div
    data-testid="shutdown-screen"
    class="fixed inset-0 z-shutdown flex flex-col items-center justify-center gap-3 bg-black"
    @click="$emit('powerOn')"
  >
    <p class="font-xp-display text-[22px] text-luna-orange">
      {{ message }}
    </p>
    <p class="text-[13px] text-white/50">
      {{ hint }}
    </p>
  </div>
</template>
