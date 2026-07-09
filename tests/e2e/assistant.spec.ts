import { expect, test } from '@playwright/test'
import { bootDesktop } from './helpers'

test.describe('desktop assistant', () => {
  test('shows the default agent to first-time visitors and lets them turn it off', async ({
    page,
  }) => {
    await bootDesktop(page, '/', true)

    const assistant = page.getByTestId('assistant')
    await expect(assistant).toBeVisible()

    // It must sit inside the viewport, not off-screen at the default corner.
    const box = await assistant.boundingBox()
    const viewport = page.viewportSize()
    expect(box).not.toBeNull()
    expect(viewport).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.y).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width)

    await page.locator('main').click({ button: 'right', position: { x: 500, y: 300 } })
    await page.getByText('Assistant', { exact: true }).hover()
    await page.getByRole('button', { name: 'None (off)' }).click()

    await expect(assistant).toHaveCount(0)
  })

  test('stays hidden for a returning visitor who turned it off', async ({ page }) => {
    await bootDesktop(page)

    await expect(page.getByTestId('assistant')).toHaveCount(0)
  })
})
