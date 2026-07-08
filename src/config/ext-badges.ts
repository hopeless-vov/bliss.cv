/*
 * File-type badge styling for start-menu items. Keys are the uppercase
 * extension from extFromLabel; classes are static so Tailwind can see them.
 */
export const EXT_BADGE_CLASSES: Record<string, string> = {
  EXE: 'bg-badge-exe text-white',
  DOC: 'bg-badge-doc text-white',
  VUE: 'bg-badge-vue text-white',
  JS: 'bg-badge-js text-ink',
  ZIP: 'bg-badge-zip text-white',
}
