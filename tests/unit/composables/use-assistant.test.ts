import { useAssistant } from '@/composables/use-assistant'
import type { AssistantHandle } from '@/lib/clippy-agent'
import { loadAssistant } from '@/lib/clippy-agent'
import { useAssistantStore } from '@/stores/assistant'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { withSetup } from '../test-host'

// The boundary owns the DOM + vendored runtime; here we only care that the
// composable drives it correctly, so it's fully mocked.
vi.mock('@/lib/clippy-agent', () => ({ loadAssistant: vi.fn() }))

const load = vi.mocked(loadAssistant)

function fakeHandle(hasAnimation = true): AssistantHandle {
  return {
    play: vi.fn(),
    animate: vi.fn(),
    speak: vi.fn(),
    hasAnimation: vi.fn(() => hasAnimation),
    destroy: vi.fn(),
  }
}

function mountAssistant() {
  return withSetup(() => useAssistant())
}

describe('useAssistant', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  it('exposes reactive enabled + name from the store', () => {
    const assistant = mountAssistant()

    expect(assistant.enabled.value).toBe(true)
    expect(assistant.name.value).toBe('Clippy')
  })

  it('react is a no-op when no agent is loaded', () => {
    const assistant = mountAssistant()

    expect(() => assistant.react({ type: 'greet' })).not.toThrow()
    expect(useAssistantStore().handle).toBeNull()
  })

  it('load fetches the agent and stores the handle when enabled', async () => {
    const handle = fakeHandle()
    load.mockResolvedValue(handle)
    const assistant = mountAssistant()

    await assistant.load()

    expect(load).toHaveBeenCalledWith('Clippy')
    expect(useAssistantStore().handle).toBe(handle)
  })

  it('load does nothing when the assistant is disabled', async () => {
    const store = useAssistantStore()
    store.setEnabled(false)
    const assistant = mountAssistant()

    await assistant.load()

    expect(load).not.toHaveBeenCalled()
    expect(store.handle).toBeNull()
  })

  it('load discards a stale agent when the name changed mid-load', async () => {
    const store = useAssistantStore()
    const handle = fakeHandle()
    load.mockImplementation(async () => {
      store.setName('Merlin') // visitor switched agents while loading
      return handle
    })
    const assistant = mountAssistant()

    await assistant.load()

    expect(handle.destroy).toHaveBeenCalledTimes(1)
    expect(store.handle).toBeNull()
  })

  it('load discards the agent when turned off mid-load', async () => {
    const store = useAssistantStore()
    const handle = fakeHandle()
    load.mockImplementation(async () => {
      store.setEnabled(false)
      return handle
    })
    const assistant = mountAssistant()

    await assistant.load()

    expect(handle.destroy).toHaveBeenCalledTimes(1)
    expect(store.handle).toBeNull()
  })

  it('load destroys the previous handle before storing a new one', async () => {
    const first = fakeHandle()
    const second = fakeHandle()
    load.mockResolvedValueOnce(first).mockResolvedValueOnce(second)
    const assistant = mountAssistant()

    await assistant.load()
    await assistant.load()

    expect(first.destroy).toHaveBeenCalledTimes(1)
    expect(useAssistantStore().handle).toBe(second)
  })

  it('react plays the mapped animation and speaks the line', async () => {
    const handle = fakeHandle(true)
    load.mockResolvedValue(handle)
    const assistant = mountAssistant()
    await assistant.load()

    assistant.react({ type: 'open', kind: 'about' })

    expect(handle.play).toHaveBeenCalledWith('Wave')
    expect(handle.animate).not.toHaveBeenCalled()
    expect(handle.speak).toHaveBeenCalledWith(expect.stringContaining('Volodymyr'))
  })

  it('react falls back to a random animation when the agent lacks the mapped one', async () => {
    const handle = fakeHandle(false)
    load.mockResolvedValue(handle)
    const assistant = mountAssistant()
    await assistant.load()

    assistant.react({ type: 'note' })

    expect(handle.animate).toHaveBeenCalledTimes(1)
    expect(handle.play).not.toHaveBeenCalled()
    expect(handle.speak).toHaveBeenCalledTimes(1)
  })

  it('greet plays the greeting once loaded', async () => {
    const handle = fakeHandle(true)
    load.mockResolvedValue(handle)
    const assistant = mountAssistant()
    await assistant.load()

    assistant.greet()

    expect(handle.play).toHaveBeenCalledWith('Greeting')
    expect(handle.speak).toHaveBeenCalledWith(expect.stringContaining('help'))
  })

  it('enable turns on, loads, and greets', async () => {
    const store = useAssistantStore()
    store.setEnabled(false)
    const handle = fakeHandle(true)
    load.mockResolvedValue(handle)
    const assistant = mountAssistant()

    await assistant.enable()

    expect(store.enabled).toBe(true)
    expect(store.handle).toBe(handle)
    expect(handle.play).toHaveBeenCalledWith('Greeting')
  })

  it('disable destroys the handle and turns off', async () => {
    const handle = fakeHandle()
    load.mockResolvedValue(handle)
    const assistant = mountAssistant()
    await assistant.load()

    assistant.disable()

    expect(handle.destroy).toHaveBeenCalledTimes(1)
    const store = useAssistantStore()
    expect(store.handle).toBeNull()
    expect(store.enabled).toBe(false)
  })

  it('disable is safe when nothing is loaded', () => {
    const assistant = mountAssistant()

    expect(() => assistant.disable()).not.toThrow()
    expect(useAssistantStore().enabled).toBe(false)
  })

  it('setAgent switches the name and re-enables with the new agent', async () => {
    const handle = fakeHandle(true)
    load.mockResolvedValue(handle)
    const assistant = mountAssistant()

    await assistant.setAgent('Merlin')

    const store = useAssistantStore()
    expect(store.name).toBe('Merlin')
    expect(store.enabled).toBe(true)
    expect(load).toHaveBeenCalledWith('Merlin')
  })

  it('setAgent is a no-op when picking the already-active agent', async () => {
    const assistant = mountAssistant()

    await assistant.setAgent('Clippy')

    expect(load).not.toHaveBeenCalled()
  })
})
