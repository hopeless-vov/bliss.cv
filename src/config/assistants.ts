/*
 * The desktop assistants, mirroring the agents vendored in `@/lib/clippy/agents`
 * (the `name` must match an export there exactly). Labels live in en.json under
 * `assistants.<key>`, resolved via useDynamicText in the context menu.
 */
export type AssistantName =
  | 'Clippy'
  | 'Merlin'
  | 'Rover'
  | 'Links'
  | 'Genius'
  | 'Bonzi'
  | 'F1'
  | 'Genie'
  | 'Peedy'
  | 'Rocky'

export interface AssistantOption {
  name: AssistantName
  /** i18n key of the context-menu label. */
  labelKey: string
}

export const ASSISTANTS: AssistantOption[] = [
  { name: 'Clippy', labelKey: 'assistants.clippy' },
  { name: 'Merlin', labelKey: 'assistants.merlin' },
  { name: 'Rover', labelKey: 'assistants.rover' },
  { name: 'Links', labelKey: 'assistants.links' },
  { name: 'Genius', labelKey: 'assistants.genius' },
  { name: 'Bonzi', labelKey: 'assistants.bonzi' },
  { name: 'F1', labelKey: 'assistants.f1' },
  { name: 'Genie', labelKey: 'assistants.genie' },
  { name: 'Peedy', labelKey: 'assistants.peedy' },
  { name: 'Rocky', labelKey: 'assistants.rocky' },
]

/** First-time visitors get Clippy, greeting them right after boot. */
export const DEFAULT_ASSISTANT: AssistantName = 'Clippy'
