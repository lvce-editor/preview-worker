import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.html-live-update'

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

  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const messageId = `html-message-${uniqueId}`
  const filePath = `${tmpDir}/preview-test-html-live-update-${uniqueId}.html`
  const initialHtml = `<!DOCTYPE html>
<html>
<body>
  <p id="${messageId}">Before update</p>
</body>
</html>`
  const updatedHtml = `<!DOCTYPE html>
<html>
<body>
  <p id="${messageId}">After update</p>
</body>
</html>`

  await FileSystem.writeFile(filePath, initialHtml)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const message = previewArea.locator(`#${messageId}`)
  await expect(message).toBeVisible()
  await expect(message).toContainText('Before update')

  await Editor.setText(updatedHtml)

  await waitForText(expect, message, 'After update')
}
