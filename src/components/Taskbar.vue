<script setup lang="ts">
import StartButton from '@/components/ui/StartButton.vue'
import TaskbarButton from '@/components/ui/TaskbarButton.vue'
import TaskbarClock from '@/components/ui/TaskbarClock.vue'
import { useClock } from '@/composables/use-clock'
import { useDynamicText } from '@/composables/use-dynamic-text'
import { useStartMenu } from '@/composables/use-start-menu'
import { useWindowManager } from '@/composables/use-window-manager'
import { DESKTOP_ITEMS } from '@/config/desktop-items'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const td = useDynamicText()
const { windows, focusedId, toggleMinimized } = useWindowManager()
const { toggle } = useStartMenu()
const { time } = useClock(false)

const ICON_BY_ID = new Map(DESKTOP_ITEMS.map((item) => [item.id, item.icon]))

// Each open window becomes a taskbar button, carrying its desktop icon.
const buttons = computed(() =>
  windows.value.flatMap((win) => {
    const icon = ICON_BY_ID.get(win.id)
    return icon ? [{ id: win.id, icon, minimized: win.minimized }] : []
  }),
)
</script>

<template>
  <footer class="xp-taskbar absolute inset-x-0 bottom-0 z-taskbar flex h-8 items-center">
    <StartButton
      :label="t('taskbar.start')"
      @click="toggle"
    />
    <div class="flex min-w-0 flex-1 items-center gap-1 px-2">
      <TaskbarButton
        v-for="button in buttons"
        :key="button.id"
        :label="td(`icons.${button.id}`)"
        :icon="button.icon"
        :active="!button.minimized && button.id === focusedId"
        @click="toggleMinimized(button.id)"
      />
    </div>
    <TaskbarClock :time="time" />
  </footer>
</template>
