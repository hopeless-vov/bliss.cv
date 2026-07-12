import { expect, test } from '@playwright/test'

test.describe('boot sequence', () => {
  test('shows the boot screen, then reveals the desktop once skipped', async ({ page }) => {
    await page.goto('/')

    const boot = page.getByTestId('boot-screen')
    await expect(boot).toBeVisible()
    await expect(boot).toContainText('Volodymyr')

    await boot.click()
    await expect(boot).toBeHidden()

    // The taskbar's Start button is the tell-tale that the desktop is up.
    await expect(page.getByRole('button', { name: 'start' })).toBeVisible()
  })
})
