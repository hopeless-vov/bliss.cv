<script setup lang="ts">
import { useWindowContent } from '@/composables/use-window-content'
import type { WindowKind } from '@/types/desktop'

const props = defineProps<{ kind: WindowKind; base: string }>()

const { header, bullets, about, experience, skillGroups, education, archivedGroups, contactLinks } =
  useWindowContent(() => props.base)
</script>

<template>
  <article class="px-6 py-6 text-[13px] leading-relaxed text-ink sm:px-12 sm:py-9">
    <header class="border-b border-neutral-200 pb-4">
      <p class="font-mono text-xs tracking-wider text-ink/60 uppercase">
        {{ header.meta }}
      </p>
      <h1
        class="font-xp-display mt-2 text-[26px] leading-tight font-bold text-luna-blue-dark sm:text-[34px]"
      >
        {{ header.title }}
      </h1>
      <p class="mt-3 max-w-140">
        {{ header.intro }}
      </p>
    </header>

    <template v-if="kind === 'about'">
      <h2 class="mt-6 text-[15px] font-bold text-luna-blue-dark">
        {{ about.interestsHeading }}
      </h2>
      <ul class="mt-2 list-disc space-y-1 pl-5">
        <li
          v-for="(interest, i) in about.interests"
          :key="i"
        >
          {{ interest }}
        </li>
      </ul>
      <h2 class="mt-6 text-[15px] font-bold text-luna-blue-dark">
        {{ about.locationHeading }}
      </h2>
      <p class="mt-2">
        {{ about.location }}
      </p>
    </template>

    <template v-else-if="kind === 'experience'">
      <h2 class="mt-6 text-[15px] font-bold text-luna-blue-dark">
        {{ experience.stackHeading }}
      </h2>
      <p class="mt-2 text-ink/80">
        {{ experience.stack }}
      </p>
      <ul class="mt-4 list-disc space-y-2 pl-5">
        <li
          v-for="(bullet, i) in bullets"
          :key="i"
        >
          {{ bullet }}
        </li>
      </ul>
    </template>

    <template v-else-if="kind === 'skills'">
      <div
        v-for="group in skillGroups"
        :key="group.heading"
      >
        <h2 class="mt-6 text-[15px] font-bold text-luna-blue-dark">
          {{ group.heading }}
        </h2>
        <ul class="mt-2 flex flex-wrap gap-2">
          <li
            v-for="(item, i) in group.items"
            :key="i"
            class="border border-content-border bg-window px-2 py-1 rounded-xs"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </template>

    <template v-else-if="kind === 'education'">
      <h2 class="mt-6 text-[15px] font-bold text-luna-blue-dark">
        {{ education.alsoTaughtHeading }}
      </h2>
      <p class="mt-2">
        {{ education.alsoTaught }}
      </p>
    </template>

    <template v-else-if="kind === 'contact'">
      <ul class="mt-6 space-y-3">
        <li
          v-for="link in contactLinks"
          :key="link.label"
          class="flex flex-col"
        >
          <span class="text-xs tracking-wider text-ink/60 uppercase">{{ link.label }}</span>
          <a
            :href="link.href"
            class="text-luna-blue underline underline-offset-2"
            target="_blank"
            rel="noopener"
          >
            {{ link.value }}
          </a>
        </li>
      </ul>
    </template>

    <template v-else-if="kind === 'recycle'">
      <div
        v-for="group in archivedGroups"
        :key="group.heading"
      >
        <h2 class="mt-6 text-[15px] font-bold text-luna-blue-dark">
          {{ group.heading }}
        </h2>
        <ul class="mt-2 list-disc space-y-1 pl-5">
          <li
            v-for="(bullet, i) in group.bullets"
            :key="i"
          >
            {{ bullet }}
          </li>
        </ul>
      </div>
    </template>
  </article>
</template>
