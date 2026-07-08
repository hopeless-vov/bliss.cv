<script setup lang="ts">
import XpWindow from '@/components/ui/XpWindow.vue'
import WindowContent from '@/components/WindowContent.vue'
import { useContextMenu } from '@/composables/use-context-menu'
import { useDynamicText } from '@/composables/use-dynamic-text'
import { useFocusTrap } from '@/composables/use-focus-trap'
import { usePointerDrag } from '@/composables/use-pointer-drag'
import { useStartMenu } from '@/composables/use-start-menu'
import { useWindowManager } from '@/composables/use-window-manager'
import { DESKTOP_ITEMS } from '@/config/desktop-items'
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const td = useDynamicText()
const { openId, isVisible, isMaximized, position, close, minimize, toggleMaximize, moveTo } =
  useWindowManager()
const { close: closeStartMenu } = useStartMenu()
const { close: closeContextMenu } = useContextMenu()

const menu = computed(() => [
  t('menubar.file'),
  t('menubar.edit'),
  t('menubar.view'),
  t('menubar.help'),
])

const openItem = computed(() => DESKTOP_ITEMS.find((item) => item.id === openId.value) ?? null)
const windowTitle = computed(() =>
  openItem.value?.i18nBase ? td(`${openItem.value.i18nBase}.title`) : '',
)

const root = ref<HTMLElement | null>(null)
useFocusTrap(root, () => isVisible.value)

// Move focus into the window when it opens, so keyboard users land inside it.
watch(isVisible, async (visible) => {
  if (visible) {
    await nextTick()
    root.value?.focus()
  }
})

const drag = usePointerDrag((x, y) => moveTo(x, y))

function onTitlebarPointerDown(event: PointerEvent): void {
  closeStartMenu()
  closeContextMenu()
  if (!isMaximized.value) {
    drag.start(event, position.value)
  }
}
</script>

<template>
  <Transition name="xp-window">
    <div
      v-if="isVisible && openItem"
      ref="root"
      role="dialog"
      aria-modal="true"
      :aria-label="windowTitle"
      tabindex="-1"
      class="absolute z-window outline-none"
      :class="
        isMaximized
          ? 'top-0 right-0 bottom-8 left-0'
          : 'h-[min(540px,calc(100dvh-90px))] w-[min(740px,94vw)]'
      "
      :style="isMaximized ? undefined : { left: `${position.x}px`, top: `${position.y}px` }"
    >
      <XpWindow
        :title="`C:\\Portfolio\\${windowTitle}`"
        :menu="menu"
        :maximized="isMaximized"
        class="h-full w-full"
        @close="close"
        @minimize="minimize"
        @maximize="toggleMaximize"
        @titlebar-pointer-down="onTitlebarPointerDown"
        @titlebar-dblclick="toggleMaximize"
      >
        <template #icon>
          <span class="block h-3.5 w-3.5 rounded-xs bg-white" />
        </template>

        <WindowContent
          v-if="openItem.kind && openItem.i18nBase"
          :kind="openItem.kind"
          :base="openItem.i18nBase"
        />
      </XpWindow>
    </div>
  </Transition>
</template>
