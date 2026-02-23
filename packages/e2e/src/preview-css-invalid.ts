import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-invalid'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-css-invalid.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Invalid CSS Test</title>
  <style>
    #target {
      color: rgb(255, 0, 0);
      this-is-invalid;
      background-color: rgb(255, 255, 0);
    }
  </style>
</head>
<body>
  <div id="target">Invalid CSS should not break preview</div>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target')
  await expect(target).toBeVisible()
  await expect(target).toHaveCSS('color', 'rgb(255, 0, 0)')
}
