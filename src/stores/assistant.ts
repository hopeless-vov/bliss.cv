import type { AssistantName } from '@/config/assistants'
import { DEFAULT_ASSISTANT } from '@/config/assistants'
import type { AssistantHandle } from '@/lib/clippy-agent'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

/*
 * Thin state for the desktop assistant. `enabled` defaults ON so first-time
 * visitors are greeted; both choices persist under the XP keys. `handle` is the
 * live (non-serialisable) agent, kept in a shallowRef out of localStorage.
 */
export const useAssistantStore = defineStore('assistant', () => {
  const enabled = useLocalStorage('xp-assistant', true)
  const name = useLocalStorage<AssistantName>('xp-assistant-name', DEFAULT_ASSISTANT)
  const handle = shallowRef<AssistantHandle | null>(null)

  function setEnabled(value: boolean): void {
    enabled.value = value
  }

  function setName(value: AssistantName): void {
    name.value = value
  }

  function setHandle(value: AssistantHandle | null): void {
    handle.value = value
  }

  return { enabled, name, handle, setEnabled, setName, setHandle }
})
