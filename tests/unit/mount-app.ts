import i18n from '@/i18n'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import type { Component } from 'vue'

/*
 * Mount a smart component with the app's i18n + a fresh Pinia. The pinia is set
 * active so a test can read the same stores the component mutates.
 */
export function mountApp(component: Component, options: Record<string, unknown> = {}) {
  const pinia = createPinia()
  setActivePinia(pinia)
  return mount(component, {
    global: { plugins: [pinia, i18n] },
    ...options,
  })
}
