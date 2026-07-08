import i18n from '@/i18n'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

/*
 * Runs a composable inside a real component setup() with the app's i18n
 * installed — required for composables that call useI18n().
 */
export function withSetup<T>(setup: () => T): T {
  let result: T | undefined
  mount(
    defineComponent({
      setup() {
        result = setup()
        return () => h('div')
      },
    }),
    { global: { plugins: [i18n] } },
  )
  return result as T
}
