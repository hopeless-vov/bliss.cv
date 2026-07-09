import type { AssistantName } from '@/config/assistants'
import { initAgent } from '@/lib/clippy'
import * as agents from '@/lib/clippy/agents'

/*
 * The typed seam between the app and the vendored clippyjs runtime (which is
 * all `any` internally). Components and composables only ever touch these five
 * methods — never the Agent class directly. This is a `lib/` boundary: excluded
 * from coverage, exercised through e2e.
 */
export interface AssistantHandle {
  play: (animation: string) => void
  animate: () => void
  speak: (text: string) => void
  hasAnimation: (name: string) => boolean
  destroy: () => void
}

type Agent = Awaited<ReturnType<typeof initAgent>>

const AGENT_LOADERS = agents as unknown as Record<AssistantName, Parameters<typeof initAgent>[0]>

/*
 * Below the taskbar (z-1000) and menus so it never blocks a click, above the
 * open window (z-100) so it stays visible. See the z-scale in main.css.
 */
const ASSISTANT_Z_INDEX = '900'

/* Park the agent bottom-right, clear of the taskbar, with no travel animation. */
function placeOnScreen(agent: Agent): void {
  const x = Math.max(16, window.innerWidth - 220)
  const y = Math.max(16, window.innerHeight - 220)
  agent.moveTo(x, y, 0)
}

/*
 * The vendored agent + balloon are bare <div>s appended to <body> with an
 * inline z-index of 10001 (above every overlay). Pull them under our scale and
 * tag the agent so e2e can find it.
 */
function integrate(agent: Agent): void {
  agent._el.dataset.testid = 'assistant'
  agent._el.style.zIndex = ASSISTANT_Z_INDEX
  const balloon = agent._balloon?._balloon
  if (balloon) balloon.style.zIndex = ASSISTANT_Z_INDEX
}

export async function loadAssistant(name: AssistantName): Promise<AssistantHandle> {
  const agent = await initAgent(AGENT_LOADERS[name])
  agent.show(true)
  integrate(agent)
  placeOnScreen(agent)

  return {
    play: (animation) => {
      agent.stop()
      agent.play(animation)
    },
    animate: () => {
      agent.stop()
      agent.animate()
    },
    speak: (text) => agent.speak(text),
    hasAnimation: (animation) => Boolean(agent.hasAnimation(animation)),
    destroy: () => agent.dispose(),
  }
}
