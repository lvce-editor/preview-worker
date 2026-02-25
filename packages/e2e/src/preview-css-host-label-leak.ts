import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-host-label-leak'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-css-host-label-leak.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Host CSS Leak Label Test</title>
</head>
<body>
  <div id="target" class="Label">line 1 line 2</div>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target')
  await expect(target).toBeVisible()
  await expect(target).toHaveCSS('white-space', 'pre')
}
