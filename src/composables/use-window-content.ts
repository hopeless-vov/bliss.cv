import { useDynamicText } from '@/composables/use-dynamic-text'
import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'
import { useI18n } from 'vue-i18n'

/*
 * Everything a content window renders, derived from the en.json tree for the
 * given i18n base. All key resolution lives here (never in the template), and
 * lists are resolved defensively — a missing key yields an empty list.
 */
export function useWindowContent(base: MaybeRefOrGetter<string>) {
  const { tm, rt } = useI18n()
  const t = useDynamicText()

  function list(key: string): string[] {
    const raw: unknown = tm(key as never)
    return Array.isArray(raw) ? raw.map((entry) => rt(entry as string)) : []
  }

  const header = computed(() => ({
    meta: t(`${toValue(base)}.meta`),
    title: t(`${toValue(base)}.title`),
    intro: t(`${toValue(base)}.intro`),
  }))

  const bullets = computed(() => list(`${toValue(base)}.bullets`))

  const about = computed(() => ({
    interestsHeading: t(`${toValue(base)}.interestsHeading`),
    interests: list(`${toValue(base)}.interests`),
    locationHeading: t(`${toValue(base)}.locationHeading`),
    location: t(`${toValue(base)}.location`),
  }))

  const experience = computed(() => ({
    stackHeading: t('experience.stackHeading'),
    stack: t(`${toValue(base)}.stack`),
  }))

  const skillGroups = computed(() => [
    { heading: t(`${toValue(base)}.languagesHeading`), items: list(`${toValue(base)}.languages`) },
    {
      heading: t(`${toValue(base)}.frameworksHeading`),
      items: list(`${toValue(base)}.frameworks`),
    },
    { heading: t(`${toValue(base)}.toolsHeading`), items: list(`${toValue(base)}.tools`) },
  ])

  const education = computed(() => ({
    alsoTaughtHeading: t(`${toValue(base)}.alsoTaughtHeading`),
    alsoTaught: t(`${toValue(base)}.alsoTaught`),
  }))

  const archivedGroups = computed(() => [
    { heading: t('archived.freelance.heading'), bullets: list('archived.freelance.bullets') },
    { heading: t('archived.logos.heading'), bullets: list('archived.logos.bullets') },
  ])

  const contactLinks = computed(() => {
    const email = t('profile.email')
    const phone = t('profile.phone')
    const linkedin = t('profile.linkedin')
    return [
      { label: t('windows.contact.emailLabel'), value: email, href: `mailto:${email}` },
      {
        label: t('windows.contact.phoneLabel'),
        value: phone,
        href: `tel:${phone.replace(/[^0-9+]/g, '')}`,
      },
      { label: t('windows.contact.linkedinLabel'), value: linkedin, href: `https://${linkedin}` },
    ]
  })

  return { header, bullets, about, experience, skillGroups, education, archivedGroups, contactLinks }
}
