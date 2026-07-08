import { useStartMenu } from '@/composables/use-start-menu'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

describe('useStartMenu', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('toggles open and closed', () => {
    const menu = useStartMenu()
    expect(menu.isOpen.value).toBe(false)

    menu.toggle()
    expect(menu.isOpen.value).toBe(true)

    menu.toggle()
    expect(menu.isOpen.value).toBe(false)
  })

  it('close is idempotent', () => {
    const menu = useStartMenu()
    menu.toggle()

    menu.close()
    menu.close()

    expect(menu.isOpen.value).toBe(false)
  })
})
