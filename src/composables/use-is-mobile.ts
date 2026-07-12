import { MOBILE_BREAKPOINT } from '@/config/constants'
import { useWindowSize } from '@vueuse/core'
import { computed, type ComputedRef } from 'vue'

/*
 * Single source of truth for "are we on a phone-sized viewport". Drives the
 * window full-screen rule, single-tap icon opening, and hiding the assistant.
 */
export function useIsMobile(): ComputedRef<boolean> {
  const { width } = useWindowSize()
  return computed(() => width.value <= MOBILE_BREAKPOINT)
}
