import { expect, test } from '@playwright/test'
import { bootDesktop, windowLocator } from './helpers'

test.describe('start menu and power', () => {
  test('opens a window from the start menu', async ({ page }) => {
    await bootDesktop(page)

    await page.getByRole('button', { name: 'start' }).click()
    await expect(page.getByRole('button', { name: 'Turn Off Computer' })).toBeVisible()

    await page.getByRole('button', { name: 'Skills', exact: true }).click()

    const win = windowLocator(page)
    await expect(win.getByRole('heading', { level: 1 })).toHaveText('Skills')
  })

  test('shuts down and boots back up', async ({ page }) => {
    await bootDesktop(page)

    await page.getByRole('button', { name: 'start' }).click()
    await page.getByRole('button', { name: 'Turn Off Computer' }).click()

    const shutdown = page.getByTestId('shutdown-screen')
    await expect(shutdown).toBeVisible()
    await expect(shutdown).toContainText('safe to close this tab')

    await shutdown.click()
    await expect(page.getByTestId('boot-screen')).toBeVisible()
  })
})
