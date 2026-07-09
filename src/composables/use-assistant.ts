import type { AssistantName } from '@/config/assistants'
import { useAssistantStore } from '@/stores/assistant'
import type { AssistantEvent } from '@/utils/assistant-reactions'
import { reactionFor } from '@/utils/assistant-reactions'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/*
 * Behaviour for the desktop assistant: it reacts to what the visitor does
 * (opens a window, drops a note, boots up) by playing an animation and saying a
 * line. Loading the (heavy) agent is deferred to a dynamic import so it never
 * touches the initial bundle; the boundary in `@/lib/clippy-agent` owns the DOM.
 */
export function useAssistant() {
  const store = useAssistantStore()
  const { t } = useI18n()

  const enabled = computed(() => store.enabled)
  const name = computed(() => store.name)

  // Lines are dynamic keys (funneled through `as never`, guarded by the i18n
  // content-shape test). The agent's name is always passed so `{name}` in the
  // greeting resolves; other lines simply ignore the unused param.
  function say(key: string): string {
    return t(key as never, { name: store.name } as never)
  }

  function react(event: AssistantEvent): void {
    const handle = store.handle
    if (!handle) return

    const reaction = reactionFor(event)
    if (handle.hasAnimation(reaction.animation)) {
      handle.play(reaction.animation)
    } else {
      handle.animate()
    }
    handle.speak(say(reaction.sayKey))
  }

  function greet(): void {
    react({ type: 'greet' })
  }

  async function load(): Promise<void> {
    if (!store.enabled) return

    const requested = store.name
    const { loadAssistant } = await import('@/lib/clippy-agent')
    const handle = await loadAssistant(requested)

    // The visitor may have switched agents or turned us off mid-load; if so,
    // throw the freshly-loaded agent away instead of showing a stale one.
    if (store.name !== requested || !store.enabled) {
      handle.destroy()
      return
    }

    store.handle?.destroy()
    store.setHandle(handle)
  }

  async function enable(): Promise<void> {
    store.setEnabled(true)
    await load()
    greet()
  }

  function disable(): void {
    store.handle?.destroy()
    store.setHandle(null)
    store.setEnabled(false)
  }

  async function setAgent(next: AssistantName): Promise<void> {
    if (store.name === next && store.enabled) return
    store.setName(next)
    await enable()
  }

  return { enabled, name, react, greet, load, enable, disable, setAgent }
}
