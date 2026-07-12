import type { DinoHandle } from '@/lib/dino-canvas'
import { startDinoRunner } from '@/lib/dino-canvas'
import { useLocalStorage } from '@vueuse/core'
import { onScopeDispose } from 'vue'
import { useI18n } from 'vue-i18n'

/*
 * The offline dino runner's lifecycle: persists the best score, and starts /
 * stops the canvas engine (the DOM boundary in @/lib/dino-canvas) against a
 * given <canvas>. Components go through this seam rather than touching lib.
 */
export function useDino() {
  const { t } = useI18n()
  const best = useLocalStorage('xp-dino-best', 0)
  let handle: DinoHandle | null = null

  function stop(): void {
    handle?.destroy()
    handle = null
  }

  function start(canvas: HTMLCanvasElement): void {
    stop()
    handle = startDinoRunner(canvas, {
      best: best.value,
      labels: {
        gameOver: t('windows.browser.gameOver'),
        restart: t('windows.browser.restart'),
        hint: t('windows.browser.hint'),
      },
      onCrash: (score) => {
        if (score > best.value) best.value = score
      },
    })
  }

  function jump(): void {
    handle?.jump()
  }

  onScopeDispose(stop)

  return { best, start, stop, jump }
}
