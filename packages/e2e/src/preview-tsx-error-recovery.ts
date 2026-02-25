import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.tsx-error-recovery'

export const skip = 1

const waitForVisible = async (expect: any, locator: any): Promise<void> => {
  let lastError: unknown
  for (let i = 0; i < 40; i++) {
    try {
      await expect(locator).toBeVisible()
      return
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
  throw lastError
}

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-tsx-error-recovery-${Date.now()}.tsx`
  const invalidTsx = `export const NotComponent = () => <div id="tsx-valid">should not render</div>`
  const validTsx = `export const Component = () => <div id="tsx-valid">rendered after fix</div>`

  await FileSystem.writeFile(filePath, invalidTsx)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const validNode = previewArea.locator('#tsx-valid')
  await expect(validNode).toHaveCount(0)

  await Editor.setText(validTsx)

  await waitForVisible(expect, validNode)
  await expect(validNode).toContainText('rendered after fix')
}
