<script setup lang="ts">
import PowerIcon from '@/assets/icons/power.svg?component'
import { useDesktop } from '@/composables/use-desktop'
import { usePower } from '@/composables/use-power'
import { useStartMenu } from '@/composables/use-start-menu'
import { useStartMenuItems } from '@/composables/use-start-menu-items'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { close } = useStartMenu()
const { shutDown } = usePower()
const { leftItems, rightItems } = useStartMenuItems()
const { activateById } = useDesktop()

function openItem(id: string): void {
  activateById(id)
  close()
}
</script>

<template>
  <aside
    class="xp-window-shadow absolute bottom-8 left-0 z-start-menu flex max-h-[calc(100dvh-40px)] w-[min(380px,calc(100vw-8px))] flex-col overflow-hidden rounded-t-md border border-control-blue bg-field"
  >
    <header class="xp-startmenu-header flex items-center gap-3 p-2">
      <span
        class="xp-avatar grid h-10.5 w-10.5 shrink-0 place-items-center rounded-sm border border-white/60 text-[16px] font-bold text-white"
      >
        {{ t('startMenu.initials') }}
      </span>
      <span class="xp-title-shadow text-[14px] font-bold text-white">
        {{ t('startMenu.username') }}
      </span>
    </header>

    <div class="h-0.5 shrink-0 bg-menu-orange" />

    <div class="flex min-h-0 flex-1">
      <nav class="flex-1 overflow-y-auto bg-field py-1">
        <button
          v-for="item in leftItems"
          :key="item.id"
          type="button"
          class="flex w-full items-center gap-2 px-2 py-1.25 text-left text-xs text-ink hover:bg-highlight hover:text-white"
          @click="openItem(item.id)"
        >
          <span
            class="grid h-5.5 w-7.5 shrink-0 place-items-center rounded-xs text-[8px] font-bold"
            :class="item.badgeClass"
          >
            {{ item.ext }}
          </span>
          <span class="truncate">{{ item.label }}</span>
        </button>
      </nav>

      <nav class="w-35 overflow-y-auto border-l border-menu-right-border bg-menu-right py-1">
        <button
          v-for="item in rightItems"
          :key="item.id"
          type="button"
          class="block w-full px-3 py-1.25 text-left text-xs font-bold text-menu-right-text hover:bg-highlight hover:text-white"
          @click="openItem(item.id)"
        >
          {{ item.label }}
        </button>
      </nav>
    </div>

    <footer class="xp-startmenu-footer flex shrink-0 justify-end p-1.5">
      <button
        type="button"
        class="flex items-center gap-2 rounded-xs px-2 py-1 text-xs text-white hover:brightness-110"
        @click="shutDown"
      >
        <span
          class="xp-power-icon grid h-4.5 w-4.5 place-items-center rounded-full border border-white/50"
        >
          <PowerIcon class="h-2.25 w-2.25" />
        </span>
        {{ t('startMenu.turnOff') }}
      </button>
    </footer>
  </aside>
</template>
