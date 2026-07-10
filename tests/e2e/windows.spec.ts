import { expect, test } from '@playwright/test'
import { bootDesktop, openIcon, taskbarButton, windowByTitle, windowLocator } from './helpers'

test.describe('window lifecycle', () => {
  test('opens from a desktop icon, deep-links the URL, and closes', async ({ page }) => {
    await bootDesktop(page)

    await openIcon(page, 'About_Me.txt')

    const win = windowLocator(page)
    await expect(win).toBeVisible()
    await expect(win.getByRole('heading', { level: 1 })).toHaveText('Volodymyr Bondarenko')
    await expect(page).toHaveURL(/\/about$/)

    await win.getByRole('button', { name: 'Close' }).click()
    await expect(win).toBeHidden()
    await expect(page).toHaveURL(/\/$/)
  })

  test('minimizes to the taskbar and restores', async ({ page }) => {
    await bootDesktop(page)
    await openIcon(page, 'Skills.txt')

    const win = windowLocator(page)
    await win.getByRole('button', { name: 'Minimize' }).click()
    await expect(win).toBeHidden()

    await taskbarButton(page, 'Skills.txt').click()
    await expect(win).toBeVisible()
  })

  test('maximizes and restores via the title bar', async ({ page }) => {
    await bootDesktop(page)
    await openIcon(page, 'Contact_Me.eml')

    const win = windowLocator(page)
    const viewport = page.viewportSize()!
    const width = async () => (await win.boundingBox())!.width

    // Maximized fills the viewport width; poll so the open animation can settle.
    await win.getByRole('button', { name: 'Maximize' }).click()
    await expect.poll(width).toBe(viewport.width)

    // Restored is the constrained window width, narrower than the viewport.
    await win.getByRole('button', { name: 'Maximize' }).click()
    await expect.poll(width).toBeLessThan(viewport.width)
  })

  test('closes the focused window with the Escape key', async ({ page }) => {
    await bootDesktop(page)
    await openIcon(page, 'About_Me.txt')

    const win = windowLocator(page)
    await expect(win).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(win).toBeHidden()
  })

  test('opens several windows side by side instead of replacing content', async ({ page }) => {
    await bootDesktop(page)

    await openIcon(page, 'About_Me.txt')
    await openIcon(page, 'Skills.txt')

    // Both stay open at once; the second did not replace the first.
    await expect(windowByTitle(page, 'Volodymyr Bondarenko')).toBeVisible()
    await expect(windowByTitle(page, 'Skills')).toBeVisible()
    await expect(page.getByRole('dialog')).toHaveCount(2)
    await expect(page.getByTestId('taskbar-window-button')).toHaveCount(2)
  })

  test('brings a window to the front from its taskbar button (URL follows focus)', async ({
    page,
  }) => {
    await bootDesktop(page)

    await openIcon(page, 'About_Me.txt')
    await openIcon(page, 'Skills.txt')
    await expect(page).toHaveURL(/\/skills$/)

    // Clicking a non-focused window's taskbar button raises it to the top.
    await taskbarButton(page, 'About_Me.txt').click()
    await expect(page).toHaveURL(/\/about$/)
  })

  test('minimizing one window leaves the others open', async ({ page }) => {
    await bootDesktop(page)

    await openIcon(page, 'About_Me.txt')
    await openIcon(page, 'Skills.txt')

    await windowByTitle(page, 'Skills').getByRole('button', { name: 'Minimize' }).click()

    await expect(windowByTitle(page, 'Skills')).toBeHidden()
    await expect(windowByTitle(page, 'Volodymyr Bondarenko')).toBeVisible()
    // Both are still listed on the taskbar.
    await expect(page.getByTestId('taskbar-window-button')).toHaveCount(2)
  })
})
