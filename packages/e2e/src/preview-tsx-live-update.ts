import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.tsx-live-update'

export const skip = 1

const waitForText = async (expect: any, locator: any, value: string): Promise<void> => {
  let lastError: unknown
  for (let i = 0; i < 40; i++) {
    try {
      await expect(locator).toContainText(value)
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

  const filePath = `${tmpDir}/preview-test-tsx-update-${Date.now()}.tsx`
  const initialTsx = `export const Component = () => <p id="tsx-message">Before update</p>`
  const updatedTsx = `export const Component = () => <p id="tsx-message">After update</p>`

  await FileSystem.writeFile(filePath, initialTsx)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const message = previewArea.locator('#tsx-message')
  await expect(message).toBeVisible()
  await expect(message).toContainText('Before update')

  await Editor.setText(updatedTsx)

  await waitForText(expect, message, 'After update')
}
