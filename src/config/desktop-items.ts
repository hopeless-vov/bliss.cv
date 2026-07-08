import type { DesktopItem } from '@/types/desktop'

/*
 * The desktop's icons, in display order. This is structural data — labels and
 * copy live in en.json (keyed by id), so adding a role means: add an entry here
 * + its text under `experience.<id>` in en.json. `col`/`row` place it in the
 * default grid (icon-grid.ts); the recycle bin has its own bottom-right spot.
 */
export const DESKTOP_ITEMS: DesktopItem[] = [
  { id: 'vesper', icon: 'briefcase', action: 'window', kind: 'experience', i18nBase: 'experience.vesper', col: 0, row: 0 },
  { id: 'worth', icon: 'briefcase', action: 'window', kind: 'experience', i18nBase: 'experience.worth', col: 0, row: 1 },
  { id: 'frozeneon', icon: 'briefcase', action: 'window', kind: 'experience', i18nBase: 'experience.frozeneon', col: 0, row: 2 },
  { id: 'quinta', icon: 'briefcase', action: 'window', kind: 'experience', i18nBase: 'experience.quinta', col: 0, row: 3 },
  { id: 'surelock', icon: 'briefcase', action: 'window', kind: 'experience', i18nBase: 'experience.surelock', col: 0, row: 4 },
  { id: 'about', icon: 'person', action: 'window', kind: 'about', i18nBase: 'windows.about', col: 1, row: 0 },
  { id: 'skills', icon: 'notepad', action: 'window', kind: 'skills', i18nBase: 'windows.skills', col: 1, row: 1 },
  { id: 'education', icon: 'grad', action: 'window', kind: 'education', i18nBase: 'windows.education', col: 1, row: 2 },
  { id: 'contact', icon: 'mail', action: 'window', kind: 'contact', i18nBase: 'windows.contact', col: 1, row: 3 },
  { id: 'resume', icon: 'pdf', action: 'pdf', href: '/CV_Volodymyr.pdf', col: 2, row: 0 },
  { id: 'newNote', icon: 'note', action: 'note', col: 2, row: 1 },
  { id: 'recycle', icon: 'bin', action: 'window', kind: 'recycle', i18nBase: 'windows.recycle' },
]
