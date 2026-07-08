export type CursorId = 'default' | 'crosshair' | 'wait' | 'help'

export interface CursorOption {
  id: CursorId
  /** i18n key of the context-menu label. */
  labelKey: string
  /** Native Tailwind cursor utility — applied to the desktop root. */
  class: string
}

export const CURSORS: CursorOption[] = [
  { id: 'default', labelKey: 'context.cursorDefault', class: 'cursor-default' },
  { id: 'crosshair', labelKey: 'context.cursorCrosshair', class: 'cursor-crosshair' },
  { id: 'wait', labelKey: 'context.cursorBusy', class: 'cursor-wait' },
  { id: 'help', labelKey: 'context.cursorHelp', class: 'cursor-help' },
]
