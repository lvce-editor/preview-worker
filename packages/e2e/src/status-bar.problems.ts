import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.problems'

export const test: Test = async ({ expect, Locator }) => {
  // assert
  const statusBar = Locator('.StatusBar')
  await expect(statusBar).toBeVisible()
  const itemProblems = Locator('.StatusBarItem[name="Problems"]')
  await expect(itemProblems).toBeVisible()
}
