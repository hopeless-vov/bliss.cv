import type { AssistantHandle } from '@/lib/clippy-agent'
import { useAssistantStore } from '@/stores/assistant'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

function fakeHandle(): AssistantHandle {
  return {
    play: vi.fn(),
    animate: vi.fn(),
    speak: vi.fn(),
    hasAnimation: vi.fn(() => true),
    destroy: vi.fn(),
  }
}

describe('assistant store', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setActivePinia(createPinia())
  })

  it('defaults to enabled with Clippy and no live handle', () => {
    const store = useAssistantStore()

    expect(store.enabled).toBe(true)
    expect(store.name).toBe('Clippy')
    expect(store.handle).toBeNull()
  })

  it('sets enabled, name, and handle', () => {
    const store = useAssistantStore()
    const handle = fakeHandle()

    store.setEnabled(false)
    store.setName('Merlin')
    store.setHandle(handle)

    expect(store.enabled).toBe(false)
    expect(store.name).toBe('Merlin')
    expect(store.handle).toBe(handle)

    store.setHandle(null)
    expect(store.handle).toBeNull()
  })

  it('persists enabled and name under the XP keys', async () => {
    const store = useAssistantStore()
    store.setEnabled(false)
    store.setName('Rover')
    await nextTick()

    expect(window.localStorage.getItem('xp-assistant')).toBe('false')
    expect(window.localStorage.getItem('xp-assistant-name')).toBe('Rover')
  })
})
