<script setup lang="ts">
import CloseIcon from '@/assets/icons/close.svg?component'

defineProps<{ title: string; body: string }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <div
    class="xp-balloon-arrow absolute right-2.5 bottom-11.5 z-balloon w-74 rounded-lg border border-black bg-balloon p-3 text-xs text-ink"
  >
    <div class="flex items-start justify-between gap-2">
      <p class="font-bold">
        {{ title }}
      </p>
      <button
        type="button"
        aria-label="Close"
        data-testid="balloon-close"
        class="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-xs hover:bg-black/10"
        @click="$emit('close')"
      >
        <CloseIcon class="h-2 w-2" />
      </button>
    </div>
    <p class="mt-1 leading-relaxed">
      {{ body }}
    </p>
  </div>
</template>
