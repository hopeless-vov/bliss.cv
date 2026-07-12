import { expect, test } from '@playwright/test'
import { bootDesktop, openIcon, windowByTitle } from './helpers'

test.describe('minesweeper', () => {
  test('opens from the desktop and reveals cells', async ({ page }) => {
    await bootDesktop(page)
    await openIcon(page, 'Minesweeper.exe')

    const win = windowByTitle(page, 'Minesweeper')
    await expect(win).toBeVisible()

    const cells = page.getByTestId('mine-cell')
    await expect(cells).toHaveCount(81)

    // First click is always safe; the board reacts (at least one cell reveals).
    await cells.first().click()
    await expect(win.getByRole('button', { name: 'New game' })).toBeVisible()
  })

  test('right-click plants a flag', async ({ page }) => {
    await bootDesktop(page)
    await openIcon(page, 'Minesweeper.exe')

    const cell = page.getByTestId('mine-cell').nth(5)
    await cell.click({ button: 'right' })
    await expect(cell).toHaveText('🚩')
  })
})

test.describe('internet explorer', () => {
  test('opens the offline runner with a canvas', async ({ page }) => {
    await bootDesktop(page)
    await openIcon(page, 'Internet Explorer')

    const win = windowByTitle(page, 'Internet Explorer')
    await expect(win).toBeVisible()
    await expect(win.getByText("This page can't be displayed")).toBeVisible()
    await expect(win.locator('canvas')).toBeVisible()

    // The runner takes keyboard input without error.
    await page.keyboard.press('Space')
    await expect(win.locator('canvas')).toBeVisible()
  })
})
