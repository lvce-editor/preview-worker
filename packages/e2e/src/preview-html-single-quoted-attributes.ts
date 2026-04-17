import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.html-single-quoted-attributes'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const targetId = `message-${uniqueId}`
  const filePath = `${tmpDir}/preview-test-html-single-quoted-attributes-${uniqueId}.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Single Quoted Attributes Test</title>
</head>
<body>
  <div id='${targetId}' class='message'>Single quoted attributes render correctly</div>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator(`#${targetId}`)
  await expect(target).toBeVisible()
  await expect(target).toContainText('Single quoted attributes render correctly')
}
