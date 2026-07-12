<script setup lang="ts">
import ContextMenu from '@/components/ContextMenu.vue'
import DesktopIcons from '@/components/DesktopIcons.vue'
import DesktopWindow from '@/components/DesktopWindow.vue'
import StartMenu from '@/components/StartMenu.vue'
import StickyNotes from '@/components/StickyNotes.vue'
import Taskbar from '@/components/Taskbar.vue'
import BootScreen from '@/components/ui/BootScreen.vue'
import ShutdownScreen from '@/components/ui/ShutdownScreen.vue'
import { useAssistant } from '@/composables/use-assistant'
import { useContextMenu } from '@/composables/use-context-menu'
import { useDesktop } from '@/composables/use-desktop'
import { useEscapeKey } from '@/composables/use-escape-key'
import { useFirstRun } from '@/composables/use-first-run'
import { useNotes } from '@/composables/use-notes'
import { usePower } from '@/composables/use-power'
import { useSettings } from '@/composables/use-settings'
import { useStartMenu } from '@/composables/use-start-menu'
import { useWindowManager } from '@/composables/use-window-manager'
import { useWindowRouter } from '@/composables/use-window-router'
import { DESKTOP_ITEMS } from '@/config/desktop-items'
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { isBooting, isShutdown, boot, skipBoot } = usePower()
const { isOpen: isStartMenuOpen, close: closeStartMenu } = useStartMenu()
const { windows, focusedId, closeFocused, openDefaultLayout } = useWindowManager()
const { clearSelection } = useDesktop()
const { isFirstRun, markSeen } = useFirstRun()
const { notes } = useNotes()
const { wallpaperClass, cursorClass } = useSettings()
const assistant = useAssistant()
const contextMenu = useContextMenu()

useWindowRouter()

onMounted(() => {
  boot()
  // First-time visitors land on About + Contact open (unless a deep link
  // already opened a window); returning visitors get a clean desktop.
  if (isFirstRun() && windows.value.length === 0) {
    openDefaultLayout()
  }
  markSeen()
  // Loads during the boot screen so the download goes unnoticed; the guard is
  // inside load() (no-op when disabled or on mobile).
  void assistant.load()
})

// Greet once the boot screen clears (the agent is already loaded by then).
watch(isBooting, (booting) => {
  if (!booting && assistant.enabled.value) assistant.greet()
})

// React whenever a new window opens, keyed on its content kind. Raising or
// closing existing windows doesn't re-trigger it.
watch(
  () => windows.value.map((win) => win.id),
  (ids, previous) => {
    const opened = ids.find((id) => !previous.includes(id))
    if (!opened) return
    const kind = DESKTOP_ITEMS.find((item) => item.id === opened)?.kind
    if (kind) assistant.react({ type: 'open', kind })
  },
)

// React when a new sticky note appears (from the icon or the context menu).
watch(
  () => notes.value.length,
  (count, previous) => {
    if (count > previous) assistant.react({ type: 'note' })
  },
)

// Escape closes the topmost overlay: context menu → start menu → focused window.
useEscapeKey(() => {
  if (contextMenu.isOpen.value) {
    contextMenu.close()
  } else if (isStartMenuOpen.value) {
    closeStartMenu()
  } else if (focusedId.value) {
    closeFocused()
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
      :reg="t('boot.reg')"
      :role="t('boot.role')"
      :skip-label="t('boot.skip')"
      @skip="skipBoot"
    />
  </main>
</template>
