<script setup lang="ts">
import { useMinesweeper } from '@/composables/use-minesweeper'
import { formatLed } from '@/utils/minesweeper'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { grid, status, elapsed, minesLeft, reset, revealCell, flagCell } = useMinesweeper()

// Classic per-number colours (Tailwind palette — no arbitrary values).
const NUMBER_COLOR = [
  '',
  'text-blue-700',
  'text-green-700',
  'text-red-600',
  'text-blue-900',
  'text-red-900',
  'text-teal-600',
  'text-neutral-900',
  'text-neutral-500',
]

const FACE = { ready: '🙂', playing: '🙂', won: '😎', lost: '😵' } as const

const face = computed(() => FACE[status.value])

const cells = computed(() =>
  grid.value.map((cell, index) => {
    let content = ''
    if (cell.flagged && !cell.revealed) content = '🚩'
    else if (cell.revealed && cell.mine) content = '💣'
    else if (cell.revealed && cell.adjacent > 0) content = String(cell.adjacent)
    return {
      index,
      content,
      revealed: cell.revealed,
      exploded: cell.exploded,
      color: cell.revealed && !cell.mine && cell.adjacent > 0 ? NUMBER_COLOR[cell.adjacent] : '',
    }
  }),
)
</script>

<template>
  <div
    class="flex h-full flex-col items-center gap-2.5 overflow-auto bg-mine-silver p-2.5"
    @contextmenu.prevent
  >
    <!-- Status bar: mines left · reset face · timer -->
    <div
      class="flex items-center justify-between gap-3 border-[3px] border-t-mine-shadow border-r-white border-b-white border-l-mine-shadow bg-mine-silver px-1.5 py-1.5"
    >
      <div class="border border-neutral-600 bg-black px-1.5 font-mono text-[22px] font-bold tracking-wide text-mine-led">
        {{ formatLed(minesLeft) }}
      </div>
      <button
        type="button"
        :aria-label="t('windows.minesweeper.reset')"
        class="flex h-7.5 w-7.5 items-center justify-center border-[3px] border-t-white border-r-mine-shadow border-b-mine-shadow border-l-white bg-mine-silver text-lg active:border-t-mine-shadow active:border-r-white active:border-b-white active:border-l-mine-shadow"
        @click="reset"
      >
        {{ face }}
      </button>
      <div class="border border-neutral-600 bg-black px-1.5 font-mono text-[22px] font-bold tracking-wide text-mine-led">
        {{ formatLed(elapsed) }}
      </div>
    </div>

    <!-- Minefield -->
    <div
      class="grid grid-cols-9 border-[3px] border-t-mine-shadow border-r-white border-b-white border-l-mine-shadow bg-mine-silver"
    >
      <button
        v-for="cell in cells"
        :key="cell.index"
        type="button"
        data-testid="mine-cell"
        class="flex h-6 w-6 items-center justify-center font-mono text-[15px] font-bold"
        :class="[
          cell.revealed
            ? cell.exploded
              ? 'border border-neutral-500 bg-mine-boom'
              : 'border border-neutral-500 bg-mine-silver'
            : 'border-[3px] border-t-white border-r-mine-shadow border-b-mine-shadow border-l-white bg-mine-silver',
          cell.color,
        ]"
        @click="revealCell(cell.index)"
        @contextmenu.prevent.stop="flagCell(cell.index)"
      >
        {{ cell.content }}
      </button>
    </div>

    <p class="text-[11px] text-neutral-700">
      {{ t('windows.minesweeper.hint') }}
    </p>
  </div>
</template>
