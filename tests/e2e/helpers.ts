import type { Page } from '@playwright/test'

/*
 * Every test starts the same way: land on the desktop and skip the 3.4s boot
 * screen. `xp-visited` is pre-set so the first-visit default layout (About +
 * Contact) doesn't seed windows over the assertions — the `windows.spec.ts`
 * first-visit test opts out to check that behaviour directly.
 *
 * The assistant is disabled by default here: it's on for real visitors, but a
 * floating agent would otherwise sit over click targets and make assertions
 * flaky. The `assistant.spec.ts` suite opts back in to test it directly.
 */
export async function bootDesktop(page: Page, path = '/', assistant = false): Promise<void> {
  await page.addInitScript(() => window.localStorage.setItem('xp-visited', 'true'))
  if (!assistant) {
    await page.addInitScript(() => window.localStorage.setItem('xp-assistant', 'false'))
  }
  await page.goto(path)
  await page.getByTestId('boot-screen').click()
}

/* An open window, scoped so "Close"/"Minimize"/"Maximize" queries never clash with other overlays. */
export function windowLocator(page: Page) {
  return page.getByTestId('xp-window')
}

/* A specific window by its title (the dialog's accessible name), for when several are open. */
export function windowByTitle(page: Page, title: string) {
  return page.getByRole('dialog', { name: title, exact: true })
}

/* The taskbar button for a given window label (distinct from the same-named desktop icon). */
export function taskbarButton(page: Page, label: string) {
  return page.getByTestId('taskbar-window-button').filter({ hasText: label })
}

export async function openIcon(page: Page, label: string): Promise<void> {
  await page.getByRole('button', { name: label, exact: true }).dblclick()
}
