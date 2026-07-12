import { expect, test } from '@playwright/test'
import { bootDesktop, openIcon, windowByTitle } from './helpers'

/*
 * A fast, shallow cross-section of the critical paths — the kind of check worth
 * running against a production build (or a deploy preview) before shipping.
 */
test.describe('smoke', () => {
  test('serves the portfolio with the right title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Volodymyr Bondarenko/)
  })

  test('boots to the desktop and opens a window', async ({ page }) => {
    await bootDesktop(page)

    await expect(page.getByRole('button', { name: 'start' })).toBeVisible()

    await openIcon(page, 'About_Me.txt')
    await expect(windowByTitle(page, 'Volodymyr Bondarenko')).toBeVisible()
    await expect(page).toHaveURL(/\/about$/)
  })

  test('serves a blue-screen 404 for an unknown route', async ({ page }) => {
    await page.goto('/definitely-not-a-page')
    await expect(page.getByTestId('blue-screen')).toBeVisible()
  })
})
