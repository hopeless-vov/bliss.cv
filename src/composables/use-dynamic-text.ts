import { useI18n } from 'vue-i18n'

/*
 * Resolve i18n keys that are built at runtime (e.g. `experience.${id}.title`,
 * `icons.${id}`). Typed messages restrict `t()` to known static keys, so
 * dynamic keys funnel through this one string-typed seam instead of scattering
 * casts. Missing keys are caught by the content-shape test, not the type system.
 */
export function useDynamicText(): (key: string) => string {
  const { t } = useI18n()
  return (key: string) => t(key as never)
}
