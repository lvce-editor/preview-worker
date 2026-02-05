import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = 1

export const name = 'preview.problems-no-diagnostics'

export const test: Test = async ({ expect, Locator }) => {
  const statusBar = Locator('.StatusBar')
  await expect(statusBar).toBeVisible()

  const itemProblems = Locator('.StatusBarItem[name="Problems"]')
  await expect(itemProblems).toBeVisible()

  const errorIcon = itemProblems.locator('.ProblemsErrorIcon')
  await expect(errorIcon).toBeVisible()

  const warningIcon = itemProblems.locator('.ProblemsWarningIcon')
  await expect(warningIcon).toBeVisible()

  const errorText = itemProblems.locator('text=0').first()
  await expect(errorText).toBeVisible()

  const warningText = itemProblems.locator('text=0').nth(1)
  await expect(warningText).toBeVisible()
}
