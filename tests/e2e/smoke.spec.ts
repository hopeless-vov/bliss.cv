import { expect, test } from '@playwright/test'

test('serves the portfolio with the right title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Volodymyr Bondarenko/)
})
