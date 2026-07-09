import type { Page } from '@playwright/test'

/*
 * Every test starts the same way: land on the desktop, skip the 3.4s boot
 * screen, and dismiss the welcome balloon (usePower always shows it after
 * boot) so it can't shadow other "Close" buttons in later assertions.
 *
 * The assistant is disabled by default here: it's on for real visitors, but a
 * floating agent would otherwise sit over click targets and make assertions
 * flaky. The `assistant.spec.ts` suite opts back in to test it directly.
 */
export async function bootDesktop(page: Page, path = '/', assistant = false): Promise<void> {
  if (!assistant) {
    await page.addInitScript(() => window.localStorage.setItem('xp-assistant', 'false'))
  }
  await page.goto(path)
  await page.getByTestId('boot-screen').click()
  await page.getByTestId('balloon-close').click()
}

/* The single open window, scoped so "Close"/"Minimize"/"Maximize" queries never clash with other overlays. */
export function windowLocator(page: Page) {
  return page.getByTestId('xp-window')
}

export async function openIcon(page: Page, label: string): Promise<void> {
  await page.getByRole('button', { name: label, exact: true }).dblclick()
}
