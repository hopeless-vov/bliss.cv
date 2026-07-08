import { expect, test } from '@playwright/test'
import { bootDesktop, windowLocator } from './helpers'

test.describe('deep links', () => {
  test('opens the matching window directly from the URL', async ({ page }) => {
    await bootDesktop(page, '/vesper')

    await expect(windowLocator(page).getByRole('heading', { level: 1 })).toHaveText('Vesper')
  })

  test('redirects an unknown window id to the desktop', async ({ page }) => {
    await bootDesktop(page, '/not-a-real-window')

    await expect(page).toHaveURL(/\/$/)
    await expect(windowLocator(page)).toBeHidden()
  })
})
