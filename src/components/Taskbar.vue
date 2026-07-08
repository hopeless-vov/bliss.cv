<script setup lang="ts">
import StartButton from '@/components/ui/StartButton.vue'
import TaskbarButton from '@/components/ui/TaskbarButton.vue'
import TaskbarClock from '@/components/ui/TaskbarClock.vue'
import { useClock } from '@/composables/use-clock'
import { useDynamicText } from '@/composables/use-dynamic-text'
import { useStartMenu } from '@/composables/use-start-menu'
import { useWindowManager } from '@/composables/use-window-manager'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const td = useDynamicText()
const { openId, isVisible, toggleMinimized } = useWindowManager()
const { toggle } = useStartMenu()
const { time } = useClock(false)

const windowLabel = computed(() => (openId.value ? td(`icons.${openId.value}`) : ''))
</script>

<template>
  <footer class="xp-taskbar absolute inset-x-0 bottom-0 z-taskbar flex h-8 items-center">
    <StartButton
      :label="t('taskbar.start')"
      @click="toggle"
    />
    <div class="flex min-w-0 flex-1 items-center gap-1 px-2">
      <TaskbarButton
        v-if="openId"
        :label="windowLabel"
        :active="isVisible"
        @click="toggleMinimized"
      />
    </div>
    <TaskbarClock
      :time="time"
      class="mr-2"
    />
  </footer>
</template>
