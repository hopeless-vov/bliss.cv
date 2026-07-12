<script setup lang="ts">
defineProps<{
  code: string
  intro: string
  errorId: string
  advice: string
  steps: string
  technical: string[]
  restartLabel: string
  turnOffLabel: string
  hint: string
}>()

defineEmits<{ restart: []; turnOff: [] }>()

// Decorative power glyphs — bound (and aria-hidden) so they aren't read out or
// flagged as raw text.
const GLYPH = { restart: '↻', power: '⏻' }
</script>

<template>
  <div
    data-testid="blue-screen"
    class="fixed inset-0 flex flex-col items-center justify-center overflow-auto bg-bsod p-6 font-mono text-white"
  >
    <div class="w-full max-w-180">
      <div class="mb-6 inline-block bg-bsod-panel px-2.5 py-0.5 font-xp text-[15px] font-bold text-bsod">
        {{ code }}
      </div>
      <p class="mb-4 text-sm leading-relaxed">
        {{ intro }}
      </p>
      <p class="mb-4 text-sm leading-relaxed">
        {{ errorId }}
      </p>
      <p class="mb-4 text-sm leading-relaxed">
        {{ advice }}
      </p>
      <p class="mb-6 text-sm leading-relaxed">
        {{ steps }}
      </p>

      <p class="mb-6 text-[13px] leading-relaxed text-bsod-dim">
        <template
          v-for="(line, i) in technical"
          :key="i"
        >
          {{ line }}<br v-if="i < technical.length - 1">
        </template>
      </p>

      <div class="flex flex-wrap gap-3.5">
        <button
          type="button"
          class="flex items-center gap-1.5 border-2 border-t-white border-r-neutral-600 border-b-neutral-600 border-l-white bg-bsod-panel px-5 py-1.75 font-xp text-[13px] font-bold text-bsod"
          @click="$emit('restart')"
        >
          <span aria-hidden="true">{{ GLYPH.restart }}</span>{{ restartLabel }}
        </button>
        <button
          type="button"
          class="flex items-center gap-1.5 border-2 border-t-white border-r-neutral-600 border-b-neutral-600 border-l-white bg-bsod-panel px-5 py-1.75 font-xp text-[13px] font-bold text-red-800"
          @click="$emit('turnOff')"
        >
          <span aria-hidden="true">{{ GLYPH.power }}</span>{{ turnOffLabel }}
        </button>
      </div>

      <p class="mt-6 text-xs text-bsod-hint">
        {{ hint }}
      </p>
    </div>
  </div>
</template>
