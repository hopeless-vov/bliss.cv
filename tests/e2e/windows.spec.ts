import { expect, test } from '@playwright/test'
import { bootDesktop, openIcon, windowLocator } from './helpers'

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

    // Scoped by testid, not label — once open, the taskbar button and the
    // desktop icon share the same accessible name ("Skills.txt").
    await page.getByTestId('taskbar-window-button').click()
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

  test('closes the window with the Escape key', async ({ page }) => {
    await bootDesktop(page)
    await openIcon(page, 'About_Me.txt')

    const win = windowLocator(page)
    await expect(win).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(win).toBeHidden()
  })

  test('switching icons cascades the window instead of stacking a new one', async ({ page }) => {
    await bootDesktop(page)

    await openIcon(page, 'About_Me.txt')
    const win = windowLocator(page)
    await expect(win.getByRole('heading', { level: 1 })).toHaveText('Volodymyr Bondarenko')

    await openIcon(page, 'Skills.txt')
    await expect(win.getByRole('heading', { level: 1 })).toHaveText('Skills')
    await expect(page).toHaveURL(/\/skills$/)
  })
})
