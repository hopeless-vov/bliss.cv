import { expect, test } from '@playwright/test'
import { bootDesktop, openIcon } from './helpers'

test.describe('sticky notes', () => {
  test('spawns a note, lets its author edit it, drag it, and delete it', async ({ page }) => {
    await bootDesktop(page)

    await openIcon(page, 'Leave_a_Note.txt')

    const textarea = page.getByPlaceholder('Type your note…')
    await expect(textarea).toBeVisible()

    await textarea.fill('Hi Volodymyr, great portfolio!')
    await expect(textarea).toHaveValue('Hi Volodymyr, great portfolio!')

    const header = page.locator('.xp-note-header')
    const before = await header.boundingBox()
    await header.hover()
    await page.mouse.down()
    await page.mouse.move(before!.x + 120, before!.y + 80, { steps: 5 })
    await page.mouse.up()
    const after = await header.boundingBox()
    expect(after!.x).not.toBeCloseTo(before!.x, 0)

    await page.getByRole('button', { name: 'Delete note' }).click()
    await expect(textarea).toBeHidden()
  })
})
