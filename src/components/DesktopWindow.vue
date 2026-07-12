<script setup lang="ts">
import InternetExplorer from '@/components/InternetExplorer.vue'
import Minesweeper from '@/components/Minesweeper.vue'
import XpIcon from '@/components/ui/XpIcon.vue'
import XpWindow from '@/components/ui/XpWindow.vue'
import WindowContent from '@/components/WindowContent.vue'
import { useContextMenu } from '@/composables/use-context-menu'
import { useDynamicText } from '@/composables/use-dynamic-text'
import { usePointerDrag } from '@/composables/use-pointer-drag'
import { useStartMenu } from '@/composables/use-start-menu'
import { useWindowManager } from '@/composables/use-window-manager'
import { DESKTOP_ITEMS } from '@/config/desktop-items'
import type { WindowState } from '@/stores/windows'
import { computed, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const td = useDynamicText()
const { windows, focusedId, isMobile, focus, close, minimize, toggleMaximize, moveTo } =
  useWindowManager()
const { close: closeStartMenu } = useStartMenu()
const { close: closeContextMenu } = useContextMenu()

const ITEM_BY_ID = new Map(DESKTOP_ITEMS.map((item) => [item.id, item]))

const menu = computed(() => [
  t('menubar.file'),
  t('menubar.edit'),
  t('menubar.view'),
  t('menubar.help'),
])

// App-like windows (game / browser) drop the menubar and the C:\Portfolio\
// path, and size themselves; everything else is a CV "document" window.
const APP_TITLE: Partial<Record<string, string>> = {
  minesweeper: 'windows.minesweeper.title',
  browser: 'windows.browser.title',
}
const SIZE_CLASS: Record<string, string> = {
  minesweeper: 'h-94.5 w-64',
  browser: 'h-[min(520px,calc(100dvh-70px))] w-[min(740px,94vw)]',
}
const DEFAULT_SIZE = 'h-[min(540px,calc(100dvh-90px))] w-[min(740px,94vw)]'

// Minimized windows are dropped from the DOM (not just hidden), matching the
// original single-window behaviour; the taskbar still lists them.
const views = computed(() =>
  windows.value
    .filter((win) => !win.minimized)
    .map((win) => {
      const item = ITEM_BY_ID.get(win.id) ?? null
      const kind = item?.kind
      const appTitleKey = kind ? APP_TITLE[kind] : undefined
      const title = appTitleKey
        ? td(appTitleKey)
        : item?.i18nBase
          ? td(`${item.i18nBase}.title`)
          : ''
      return {
        win,
        item,
        kind,
        title,
        isApp: Boolean(appTitleKey),
        sizeClass: (kind && SIZE_CLASS[kind]) || DEFAULT_SIZE,
        maximized: win.maximized || isMobile.value,
      }
    }),
)

// Focus a window when it first appears (opens or restores) so keyboard users
// land inside it. Merely raising an existing window (a click) must NOT steal
// focus from what was clicked, so this keys off appearance, not the focused id.
const roots = new Map<string, HTMLElement>()
function setRoot(id: string, el: unknown): void {
  if (el) {
    roots.set(id, el as HTMLElement)
  } else {
    roots.delete(id)
  }
}

watch(
  () => views.value.map((view) => view.win.id),
  async (ids, previous) => {
    const appeared = ids.find((id) => !previous.includes(id))
    if (!appeared) {
      return
    }
    await nextTick()
    roots.get(appeared)?.focus()
  },
  { flush: 'post' },
)

const drag = usePointerDrag<string>((x, y, id) => moveTo(id, x, y))

function onTitlebarPointerDown(win: WindowState, event: PointerEvent): void {
  closeStartMenu()
  closeContextMenu()
  if (!(win.maximized || isMobile.value)) {
    drag.start(event, win.position, win.id)
  }
}

function styleFor(view: { win: WindowState; maximized: boolean }): Record<string, string | number> {
  // `--stack` orders windows within the z-window band (the base lives in the
  // token, see main.css); position is only needed when not maximized.
  const stack = { '--stack': view.win.z }
  return view.maximized
    ? stack
    : { ...stack, left: `${view.win.position.x}px`, top: `${view.win.position.y}px` }
}
</script>

<template>
  <TransitionGroup name="xp-window">
    <div
      v-for="view in views"
      :key="view.win.id"
      :ref="(el) => setRoot(view.win.id, el)"
      role="dialog"
      :aria-label="view.title"
      tabindex="-1"
      class="absolute z-window outline-none"
      :class="view.maximized ? 'top-0 right-0 bottom-8 left-0' : view.sizeClass"
      :style="styleFor(view)"
      @pointerdown="focus(view.win.id)"
    >
      <XpWindow
        :title="view.isApp ? view.title : `C:\\Portfolio\\${view.title}`"
        :menu="view.isApp ? [] : menu"
        :active="view.win.id === focusedId"
        :maximized="view.maximized"
        class="h-full w-full"
        @close="close(view.win.id)"
        @minimize="minimize(view.win.id)"
        @maximize="toggleMaximize(view.win.id)"
        @titlebar-pointer-down="onTitlebarPointerDown(view.win, $event)"
        @titlebar-dblclick="toggleMaximize(view.win.id)"
      >
        <template #icon>
          <XpIcon
            v-if="view.item"
            :name="view.item.icon"
            class="h-3.5 w-3.5"
          />
        </template>

        <Minesweeper v-if="view.kind === 'minesweeper'" />
        <InternetExplorer v-else-if="view.kind === 'browser'" />
        <WindowContent
          v-else-if="view.item?.kind && view.item?.i18nBase"
          :kind="view.item.kind"
          :base="view.item.i18nBase"
        />
      </XpWindow>
    </div>
  </TransitionGroup>
</template>
