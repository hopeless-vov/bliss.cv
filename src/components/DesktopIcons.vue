<script setup lang="ts">
import DesktopIcon from '@/components/ui/DesktopIcon.vue'
import { useDesktop } from '@/composables/use-desktop'
import { useDynamicText } from '@/composables/use-dynamic-text'
import { useIconPositions } from '@/composables/use-icon-positions'
import { useIsMobile } from '@/composables/use-is-mobile'
import { usePointerDrag } from '@/composables/use-pointer-drag'
import { DESKTOP_ITEMS } from '@/config/desktop-items'

const t = useDynamicText()
const { selectedId, select, activate } = useDesktop()
const { positionFor, moveIcon } = useIconPositions()
const isMobile = useIsMobile()

const { start } = usePointerDrag<string>((x, y, id) => moveIcon(id, x, y))

function onPointerDown(id: string, event: PointerEvent): void {
  start(event, positionFor(id), id)
}
</script>

<template>
  <div
    v-for="item in DESKTOP_ITEMS"
    :key="item.id"
    class="absolute"
    :style="{ left: `${positionFor(item.id).x}px`, top: `${positionFor(item.id).y}px` }"
  >
    <DesktopIcon
      :label="t(`icons.${item.id}`)"
      :icon="item.icon"
      :selected="selectedId === item.id"
      :single-click="isMobile"
      @select="select(item.id)"
      @open="activate(item)"
      @pointerdown="onPointerDown(item.id, $event)"
    />
  </div>
</template>
