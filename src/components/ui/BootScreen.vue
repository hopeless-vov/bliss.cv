<script setup lang="ts">
import WindowsFlagIcon from '@/assets/icons/windows-flag.svg?component'

defineProps<{ name: string; title: string; xp: string; role: string; skipLabel: string }>()
defineEmits<{ skip: [] }>()
</script>

<template>
  <div
    data-testid="boot-screen"
    class="fixed inset-0 z-boot flex flex-col items-center justify-center bg-black text-white"
    @click="$emit('skip')"
  >
    <div class="mb-14 flex items-center gap-4">
      <WindowsFlagIcon class="h-13 w-13" />
      <div>
        <p class="text-[15px] text-white/70">
          {{ name }}
        </p>
        <p class="font-xp-display text-[34px] leading-none font-bold">
          {{ title }}<sup class="align-super text-[18px] text-luna-orange">{{ xp }}</sup>
        </p>
      </div>
    </div>

    <div class="relative h-4.5 w-55 overflow-hidden rounded-[9px] border-2 border-neutral-400">
      <div class="xp-boot-blocks absolute inset-y-0 left-0 flex items-center gap-1">
        <span
          v-for="n in 3"
          :key="n"
          class="xp-boot-block h-2 w-2.5 rounded-[1px]"
        />
      </div>
    </div>

    <div class="absolute inset-x-0 bottom-7 flex justify-between px-7 rounded-xs text-white/60">
      <span>{{ role }}</span>
      <span>{{ skipLabel }}</span>
    </div>
  </div>
</template>
