import { expect, test } from '@playwright/test'
import { bootDesktop, windowLocator } from './helpers'

test.describe('desktop context menu', () => {
  test('changes the cursor', async ({ page }) => {
    await bootDesktop(page)

    await page.locator('main').click({ button: 'right', position: { x: 700, y: 400 } })
    await page.getByText('Cursor', { exact: true }).hover()
    await page.getByRole('button', { name: 'Crosshair' }).click()

    const cursor = await page.locator('main').evaluate((el) => getComputedStyle(el).cursor)
    expect(cursor).toBe('crosshair')
  })

  test('changes the wallpaper', async ({ page }) => {
    await bootDesktop(page)

    await page.locator('main').click({ button: 'right', position: { x: 700, y: 400 } })
    await page.getByText('Wallpaper', { exact: true }).hover()
    await page.getByRole('button', { name: 'Night Sky' }).click()

    await expect(page.locator('main.xp-wall-night')).toBeVisible()
  })

  test('opens About Me via Properties', async ({ page }) => {
    await bootDesktop(page)

    await page.locator('main').click({ button: 'right', position: { x: 700, y: 400 } })
    await page.getByRole('button', { name: 'Properties' }).click()

    await expect(windowLocator(page).getByRole('heading', { level: 1 })).toHaveText(
      'Volodymyr Bondarenko',
    )
  })
})
