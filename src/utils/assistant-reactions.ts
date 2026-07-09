import type { WindowKind } from '@/types/desktop'

/*
 * Maps something the visitor did to how the assistant responds: an animation to
 * play and the i18n key of the line to say. Animation names follow the MS Agent
 * convention; not every agent has every one, so the caller falls back to a
 * random animation when `animation` is absent (see use-assistant).
 */
export type AssistantEvent =
  | { type: 'greet' }
  | { type: 'note' }
  | { type: 'open'; kind: WindowKind }

export interface AssistantReaction {
  animation: string
  sayKey: string
}

const OPEN_REACTIONS: Record<WindowKind, AssistantReaction> = {
  about: { animation: 'Wave', sayKey: 'assistant.say.about' },
  experience: { animation: 'Explain', sayKey: 'assistant.say.experience' },
  skills: { animation: 'Thinking', sayKey: 'assistant.say.skills' },
  education: { animation: 'Congratulate', sayKey: 'assistant.say.education' },
  contact: { animation: 'GetAttention', sayKey: 'assistant.say.contact' },
  recycle: { animation: 'Alert', sayKey: 'assistant.say.recycle' },
}

export function reactionFor(event: AssistantEvent): AssistantReaction {
  switch (event.type) {
    case 'greet':
      return { animation: 'Greeting', sayKey: 'assistant.say.greet' }
    case 'note':
      return { animation: 'Writing', sayKey: 'assistant.say.note' }
    case 'open':
      return OPEN_REACTIONS[event.kind]
  }
}
