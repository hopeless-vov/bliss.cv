<script setup lang="ts">
import ContextMenu from '@/components/ContextMenu.vue'
import DesktopIcons from '@/components/DesktopIcons.vue'
import DesktopWindow from '@/components/DesktopWindow.vue'
import StartMenu from '@/components/StartMenu.vue'
import StickyNotes from '@/components/StickyNotes.vue'
import Taskbar from '@/components/Taskbar.vue'
import BalloonTip from '@/components/ui/BalloonTip.vue'
import BootScreen from '@/components/ui/BootScreen.vue'
import ShutdownScreen from '@/components/ui/ShutdownScreen.vue'
import { useContextMenu } from '@/composables/use-context-menu'
import { useDesktop } from '@/composables/use-desktop'
import { useEscapeKey } from '@/composables/use-escape-key'
import { usePower } from '@/composables/use-power'
import { useSettings } from '@/composables/use-settings'
import { useStartMenu } from '@/composables/use-start-menu'
import { useWindowManager } from '@/composables/use-window-manager'
import { useWindowRouter } from '@/composables/use-window-router'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { isBooting, isShutdown, isBalloonVisible, boot, skipBoot, dismissBalloon } = usePower()
const { isOpen: isStartMenuOpen, close: closeStartMenu } = useStartMenu()
const { isVisible: isWindowVisible, close: closeWindow } = useWindowManager()
const { clearSelection } = useDesktop()
const { wallpaperClass, cursorClass } = useSettings()
const contextMenu = useContextMenu()

useWindowRouter()

onMounted(boot)

// Escape closes the topmost overlay: context menu → start menu → window.
useEscapeKey(() => {
  if (contextMenu.isOpen.value) {
    contextMenu.close()
  } else if (isStartMenuOpen.value) {
    closeStartMenu()
  } else if (isWindowVisible.value) {
    closeWindow()
  }
})

function onDesktopClick(event: MouseEvent): void {
  closeStartMenu()
  contextMenu.close()
  if (event.target === event.currentTarget) {
    clearSelection()
  }
}

function onDesktopContextMenu(event: MouseEvent): void {
  closeStartMenu()
  contextMenu.openAt(event.clientX, event.clientY)
}
</script>

<template>
  <main
    class="relative h-full w-full overflow-hidden bg-desktop font-xp"
    :class="[wallpaperClass, cursorClass]"
  >
    <div
      class="absolute inset-0 bottom-8 flex flex-col flex-wrap content-start gap-1 p-2"
      @click="onDesktopClick"
      @contextmenu.prevent="onDesktopContextMenu"
    >
      <DesktopIcons />
    </div>

    <DesktopWindow />

    <StickyNotes />

    <StartMenu v-if="isStartMenuOpen" />

    <ContextMenu
      v-if="contextMenu.isOpen.value"
      :x="contextMenu.position.value.x"
      :y="contextMenu.position.value.y"
      @close="contextMenu.close"
    />

    <Taskbar />

    <BalloonTip
      v-if="isBalloonVisible"
      :title="t('welcome.title')"
      :body="t('welcome.body')"
      @close="dismissBalloon"
    />

    <ShutdownScreen
      v-if="isShutdown"
      :message="t('shutdown.safe')"
      :hint="t('shutdown.reboot')"
      @power-on="boot"
    />

    <BootScreen
      v-if="isBooting"
      :name="t('boot.name')"
      :title="t('boot.title')"
      :xp="t('boot.xp')"
      :role="t('boot.role')"
      :skip-label="t('boot.skip')"
      @skip="skipBoot"
    />
  </main>
</template>
