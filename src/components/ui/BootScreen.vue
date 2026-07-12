<script setup lang="ts">
import WindowsFlagIcon from '@/assets/icons/windows-flag.svg?component'

defineProps<{
  name: string
  title: string
  xp: string
  reg: string
  role: string
  skipLabel: string
}>()
defineEmits<{ skip: [] }>()
</script>

<template>
  <div
    data-testid="boot-screen"
    class="fixed inset-0 z-boot flex flex-col items-center justify-center bg-black text-white"
    @click="$emit('skip')"
  >
    <div class="mb-20 flex flex-col items-start">
      <div class="flex items-end gap-4">
        <p class="font-xp-display text-xl leading-none text-white/90">
          {{ name }}<sup class="align-super text-[0.55em]">{{ reg }}</sup>
        </p>
        <WindowsFlagIcon class="h-40 w-40 sm:h-52 sm:w-52" />
      </div>
      <p class="font-xp-display text-6xl leading-none font-bold tracking-tight">
        {{ title }}<sup class="align-super text-xl font-normal">{{ reg }}</sup>
        <sup class="align-super text-2xl font-bold text-luna-orange">{{ xp }}</sup>
      </p>
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

    <div class="absolute inset-x-0 bottom-7 flex justify-between px-7 text-white/60">
      <span>{{ role }}</span>
      <span>{{ skipLabel }}</span>
    </div>
  </div>
</template>
