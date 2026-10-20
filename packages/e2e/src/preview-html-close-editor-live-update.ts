import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.html-close-editor-live-update'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const messageId = `html-close-message-${uniqueId}`
  const filePath = `${tmpDir}/preview-test-html-close-editor-${uniqueId}.html`
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
  const message = previewArea.locator(`#${messageId}`)
  await expect(message).toContainText('Before update')

  await Editor.setText(updatedHtml)
  await Main.closeActiveEditor()
  await expect(previewArea).toBeVisible()

  await Main.openUri(filePath)
  await Editor.setText(initialHtml)
  await expect(message).toContainText('Before update')
}
