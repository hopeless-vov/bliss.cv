<script setup lang="ts">
import BinIcon from '@/assets/icons/bin.svg?component'
import BriefcaseIcon from '@/assets/icons/briefcase.svg?component'
import GradIcon from '@/assets/icons/grad.svg?component'
import MailIcon from '@/assets/icons/mail.svg?component'
import NoteIcon from '@/assets/icons/note.svg?component'
import NotepadIcon from '@/assets/icons/notepad.svg?component'
import PdfIcon from '@/assets/icons/pdf.svg?component'
import PersonIcon from '@/assets/icons/person.svg?component'
import type { XpIconName } from '@/types/desktop'

defineProps<{ name: XpIconName }>()

const ICONS = {
  briefcase: BriefcaseIcon,
  person: PersonIcon,
  notepad: NotepadIcon,
  grad: GradIcon,
  mail: MailIcon,
  pdf: PdfIcon,
  bin: BinIcon,
  note: NoteIcon,
} as const
</script>

<template>
  <component :is="ICONS[name]" />
</template>
