import { expect, test } from '@playwright/test'

test.describe('boot sequence', () => {
  test('shows the boot screen, then the welcome balloon once skipped', async ({ page }) => {
    await page.goto('/')

    const boot = page.getByTestId('boot-screen')
    await expect(boot).toBeVisible()
    await expect(boot).toContainText('Portfolio')

    await boot.click()
    await expect(boot).toBeHidden()

    await expect(page.getByText("Welcome to Volodymyr's portfolio")).toBeVisible()
    await page.getByTestId('balloon-close').click()
    await expect(page.getByText("Welcome to Volodymyr's portfolio")).toBeHidden()
  })
})
