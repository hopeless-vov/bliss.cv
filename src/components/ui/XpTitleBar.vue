<script setup lang="ts">
import XpWindowControls from '@/components/ui/XpWindowControls.vue'

withDefaults(defineProps<{ title: string; active?: boolean }>(), {
  active: true,
})

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
    class="flex items-center gap-2 rounded-t-md px-2 py-1 select-none"
    :class="active ? 'xp-titlebar-active' : 'xp-titlebar-inactive'"
    @pointerdown="$emit('titlebarPointerDown', $event)"
    @dblclick="$emit('titlebarDblclick')"
  >
    <span class="grid h-3.5 w-3.5 shrink-0 place-items-center">
      <slot name="icon" />
    </span>
    <span class="xp-title-shadow flex-1 truncate rounded-xs font-bold text-white">
      {{ title }}
    </span>
    <XpWindowControls
      @minimize="$emit('minimize')"
      @maximize="$emit('maximize')"
      @close="$emit('close')"
    />
  </div>
</template>
