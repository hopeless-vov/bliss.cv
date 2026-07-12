import { expect, test } from '@playwright/test'
import { bootDesktop, windowLocator } from './helpers'

test.describe('deep links', () => {
  test('opens the matching window directly from the URL', async ({ page }) => {
    await bootDesktop(page, '/vesper')

    await expect(windowLocator(page).getByRole('heading', { level: 1 })).toHaveText('Vesper')
  })

  test('shows the blue-screen 404 for an unknown path, and recovers to the desktop', async ({
    page,
  }) => {
    // Returning visitor (no first-visit seeding) so recovery lands on a clean /.
    await page.addInitScript(() => {
      window.localStorage.setItem('xp-visited', 'true')
      window.localStorage.setItem('xp-assistant', 'false')
    })
    await page.goto('/not-a-real-window')

    const bsod = page.getByTestId('blue-screen')
    await expect(bsod).toBeVisible()
    await expect(bsod).toContainText('ERROR 404')

    await bsod.getByRole('button', { name: /Restart Computer/ }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByTestId('boot-screen')).toBeVisible()
  })
})
