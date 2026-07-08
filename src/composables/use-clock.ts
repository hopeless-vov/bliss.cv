import { CLOCK_INTERVAL } from '@/config/constants'
import { formatClock } from '@/utils/format-clock'
import { useNow } from '@vueuse/core'
import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

/* A live taskbar clock string, refreshed on the XP cadence (every 15s). */
export function useClock(is24h: MaybeRefOrGetter<boolean>) {
  const now = useNow({ interval: CLOCK_INTERVAL })
  const time = computed(() => formatClock(now.value, toValue(is24h)))

  return { time }
}
