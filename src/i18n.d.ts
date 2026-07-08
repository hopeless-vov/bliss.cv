import type enSchema from '@/locales/en.json'

/*
 * Teach vue-i18n the shape of our messages so `t('menubar.file')` autocompletes
 * and a typo in a *static* key fails the build. Keys derived at runtime (window
 * content, icon labels) are inherently dynamic — those go through
 * useDynamicText(), and their existence is guarded by tests/unit/i18n.test.ts.
 */
declare module 'vue-i18n' {
  type MessageSchema = typeof enSchema
  export interface DefineLocaleMessage extends MessageSchema {}
}
