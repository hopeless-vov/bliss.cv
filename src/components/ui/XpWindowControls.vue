<script setup lang="ts">
import CloseIcon from '@/assets/icons/close.svg?component'

defineEmits<{
  minimize: []
  maximize: []
  close: []
}>()
</script>

<template>
  <div class="flex items-center gap-0.5">
    <button
      type="button"
      aria-label="Minimize"
      class="xp-control-btn grid h-5.25 w-5.25 place-items-end justify-center rounded-xs border border-white/90 pb-0.75 transition hover:brightness-110"
      @click="$emit('minimize')"
    >
      <span class="h-0.5 w-2.25 bg-white" />
    </button>
    <button
      type="button"
      aria-label="Maximize"
      class="xp-control-btn grid h-5.25 w-5.25 place-items-center rounded-xs border border-white/90 transition hover:brightness-110"
      @click="$emit('maximize')"
    >
      <span class="h-2.5 w-2.75 border border-t-2 border-white" />
    </button>
    <button
      type="button"
      aria-label="Close"
      class="xp-control-close grid h-5.25 w-5.25 place-items-center rounded-xs border border-white/90 text-white transition hover:brightness-125"
      @click="$emit('close')"
    >
      <CloseIcon class="h-2.25 w-2.25" />
    </button>
  </div>
</template>
