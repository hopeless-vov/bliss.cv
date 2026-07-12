import i18n from '@/i18n'
import type { DinoHandle, DinoOptions } from '@/lib/dino-canvas'
import { startDinoRunner } from '@/lib/dino-canvas'
import { useDino } from '@/composables/use-dino'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

// The canvas engine is a DOM boundary; here we only check the composable drives
// it and persists the best score, so it's fully mocked.
vi.mock('@/lib/dino-canvas', () => ({ startDinoRunner: vi.fn() }))

const start = vi.mocked(startDinoRunner)

function fakeHandle(): DinoHandle {
  return { jump: vi.fn(), destroy: vi.fn() }
}

type Api = ReturnType<typeof useDino>

function setup(): { api: Api; unmount: () => void } {
  let api!: Api
  const wrapper = mount(
    defineComponent({
      setup() {
        api = useDino()
        return () => h('div')
      },
    }),
    { global: { plugins: [i18n] } },
  )
  return { api, unmount: () => wrapper.unmount() }
}

const canvas = {} as HTMLCanvasElement

describe('useDino', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.resetAllMocks()
  })

  it('exposes the persisted best score (default 0)', () => {
    const { api } = setup()
    expect(api.best.value).toBe(0)
  })

  it('start launches the engine with the best score and localized labels', () => {
    start.mockReturnValue(fakeHandle())
    const { api } = setup()

    api.start(canvas)

    expect(start).toHaveBeenCalledTimes(1)
    const opts = start.mock.calls[0][1] as DinoOptions
    expect(opts.best).toBe(0)
    expect(opts.labels.gameOver).toBeTruthy()
    expect(opts.labels.restart).toBeTruthy()
    expect(opts.labels.hint).toBeTruthy()
  })

  it('records a new best via the onCrash callback, ignoring lower scores', () => {
    start.mockReturnValue(fakeHandle())
    const { api } = setup()
    api.start(canvas)
    const opts = start.mock.calls[0][1] as DinoOptions

    opts.onCrash(7)
    expect(api.best.value).toBe(7)

    opts.onCrash(3) // not a new best
    expect(api.best.value).toBe(7)
  })

  it('restarting destroys the previous engine first', () => {
    const first = fakeHandle()
    const second = fakeHandle()
    start.mockReturnValueOnce(first).mockReturnValueOnce(second)
    const { api } = setup()

    api.start(canvas)
    api.start(canvas)

    expect(first.destroy).toHaveBeenCalledTimes(1)
    expect(start).toHaveBeenCalledTimes(2)
  })

  it('jump proxies to the engine and is safe before start', () => {
    const handle = fakeHandle()
    start.mockReturnValue(handle)
    const { api } = setup()

    api.jump() // no engine yet → no throw
    api.start(canvas)
    api.jump()

    expect(handle.jump).toHaveBeenCalledTimes(1)
  })

  it('stop destroys the engine and is safe when idle', () => {
    const handle = fakeHandle()
    start.mockReturnValue(handle)
    const { api } = setup()

    api.stop() // nothing running → no throw
    api.start(canvas)
    api.stop()

    expect(handle.destroy).toHaveBeenCalledTimes(1)
  })

  it('stops the engine when the scope is disposed', () => {
    const handle = fakeHandle()
    start.mockReturnValue(handle)
    const { api, unmount } = setup()
    api.start(canvas)

    unmount()

    expect(handle.destroy).toHaveBeenCalledTimes(1)
  })
})
