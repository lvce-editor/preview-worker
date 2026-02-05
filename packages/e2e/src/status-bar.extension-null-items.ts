import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const name = 'preview.extension-null-items'

export const test: Test = async ({ expect, Locator }) => {
  const statusBar = Locator('.StatusBar')
  await expect(statusBar).toBeVisible()

  const itemProblems = Locator('.StatusBarItem[name="Problems"]')
  await expect(itemProblems).toBeVisible()

  const itemNotifications = Locator('.StatusBarItem[name="Notifications"]')
  await expect(itemNotifications).toBeVisible()

  const errorIcon = itemProblems.locator('.ProblemsErrorIcon')
  await expect(errorIcon).toBeVisible()

  const warningIcon = itemProblems.locator('.ProblemsWarningIcon')
  await expect(warningIcon).toBeVisible()
}
