<script setup lang="ts">
import { useDino } from '@/composables/use-dino'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { start, jump } = useDino()

// Decorative chrome glyphs — bound (and aria-hidden in the template) so they're
// not read out and don't trip the i18n raw-text rule.
const GLYPH = { e: 'e', back: '←', forward: '→', stop: '✕', refresh: '⟳', home: '⌂', go: '▶', lock: '🔒' }

const menuLabels = computed(() => [
  t('menubar.file'),
  t('menubar.edit'),
  t('menubar.view'),
  t('menubar.favorites'),
  t('menubar.tools'),
  t('menubar.help'),
])

const canvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (canvas.value) start(canvas.value)
})
</script>

<template>
  <div class="flex h-full flex-col bg-window">
    <!-- Menu bar -->
    <div class="xp-ie-menu flex items-center gap-px border-b border-ie-border px-1 py-0.5 text-[11px] text-ink">
      <span
        v-for="label in menuLabels"
        :key="label"
        class="rounded-xs px-1.75 py-0.75 hover:bg-highlight hover:text-white"
      >
        {{ label }}
      </span>
      <span
        aria-hidden="true"
        class="xp-ie-logo ml-auto flex h-3.75 w-3.75 items-center justify-center rounded-full text-[10px] font-bold text-white italic"
      >
        {{ GLYPH.e }}
      </span>
    </div>

    <!-- Toolbar -->
    <div class="xp-ie-toolbar flex items-center gap-0.75 border-b border-ie-border px-1.5 py-1">
      <span class="flex items-center gap-1.5 py-1 pr-2.5 pl-1.75 text-[11px] font-bold text-neutral-400">
        <span
          aria-hidden="true"
          class="text-[15px] leading-none"
        >{{ GLYPH.back }}</span>
        <span>{{ t('windows.browser.back') }}</span>
      </span>
      <span
        aria-hidden="true"
        class="flex h-6 w-6 items-center justify-center text-[15px] text-neutral-400"
      >{{ GLYPH.forward }}</span>
      <span class="mx-0.5 h-5 w-px bg-ie-border" />
      <span
        aria-hidden="true"
        class="flex h-6 w-6 items-center justify-center text-[13px] text-red-700"
      >{{ GLYPH.stop }}</span>
      <button
        type="button"
        :aria-label="t('windows.browser.reload')"
        class="flex h-6 w-6 items-center justify-center rounded-xs text-[15px] text-green-700 hover:bg-green-100"
        @click="jump"
      >
        <span aria-hidden="true">{{ GLYPH.refresh }}</span>
      </button>
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-xs py-1 pr-2.25 pl-1.5 text-[11px] text-ink hover:bg-highlight/15"
        @click="jump"
      >
        <span
          aria-hidden="true"
          class="text-[13px] text-luna-blue"
        >{{ GLYPH.home }}</span>
        <span>{{ t('windows.browser.home') }}</span>
      </button>
    </div>

    <!-- Address bar -->
    <div class="xp-ie-address flex items-center gap-1.5 border-b border-ie-border-strong py-1 pr-1.5 pl-2">
      <span class="text-[11px] text-neutral-600">{{ t('windows.browser.address') }}</span>
      <div class="xp-ie-field flex flex-1 items-center gap-1.5 border border-ie-field-border bg-white px-1.5 py-0.75 text-[11px] text-ink/80">
        <span
          aria-hidden="true"
          class="xp-ie-logo flex h-3.75 w-3.75 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white italic"
        >
          {{ GLYPH.e }}
        </span>
        <span class="truncate">{{ t('windows.browser.url') }}</span>
      </div>
      <button
        type="button"
        class="flex items-center gap-1 rounded-xs border border-transparent px-2.5 py-0.75 pl-2 text-[11px] text-ink hover:border-ie-field-border hover:bg-blue-50"
        @click="jump"
      >
        <span
          aria-hidden="true"
          class="text-xs text-green-600"
        >{{ GLYPH.go }}</span>
        {{ t('windows.browser.go') }}
      </button>
    </div>

    <!-- Offline error page + the dino runner -->
    <div class="flex flex-1 flex-col items-center justify-center overflow-auto bg-white p-4 text-center">
      <div class="flex max-w-117.5 flex-col items-center gap-1.5">
        <div
          aria-hidden="true"
          class="xp-ie-logo flex h-11.5 w-11.5 items-center justify-center rounded-full text-[26px] font-bold text-white italic shadow-md"
        >
          {{ GLYPH.e }}
        </div>
        <p class="font-xp-display text-[20px] font-bold text-neutral-700">
          {{ t('windows.browser.cantTitle') }}
        </p>
        <p class="text-xs leading-relaxed text-neutral-500">
          {{ t('windows.browser.cantBody') }}
        </p>
      </div>
      <canvas
        ref="canvas"
        width="600"
        height="150"
        class="mt-3.5 h-auto w-full max-w-150 cursor-pointer border border-neutral-300 bg-white"
        @click="jump"
      />
    </div>

    <!-- Status bar -->
    <div class="xp-ie-status flex items-center justify-between border-t border-white px-2 py-0.5 text-[10px] text-neutral-600">
      <div class="flex items-center gap-1.5">
        <span
          aria-hidden="true"
          class="xp-ie-offline-dot h-2.75 w-2.75 rounded-full"
        />
        <span>{{ t('windows.browser.offline') }}</span>
      </div>
      <div class="flex items-center gap-1">
        <span
          aria-hidden="true"
          class="text-neutral-500"
        >{{ GLYPH.lock }}</span>
        <span>{{ t('windows.browser.zone') }}</span>
      </div>
    </div>
  </div>
</template>
