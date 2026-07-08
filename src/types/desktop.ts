export type XpIconName =
  | 'briefcase'
  | 'person'
  | 'notepad'
  | 'grad'
  | 'mail'
  | 'pdf'
  | 'bin'
  | 'note'

export type WindowKind = 'about' | 'experience' | 'skills' | 'education' | 'contact' | 'recycle'

export type DesktopAction = 'window' | 'pdf' | 'note'

export interface DesktopItem {
  /** Stable id; also the window id and the `icons.<id>` label key. */
  id: string
  icon: XpIconName
  action: DesktopAction
  /** Present when `action === 'window'` — the i18n key prefix for its content. */
  i18nBase?: string
  /** Present when `action === 'pdf'` — the file to open. */
  href?: string
  /** Present when `action === 'window'` — how the content is laid out. */
  kind?: WindowKind
  /** Default grid column/row (icon-grid.ts). Omitted for the specially-placed recycle bin. */
  col?: number
  row?: number
}
