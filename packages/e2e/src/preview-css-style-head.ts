import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-style-head'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-css-style-head.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Style in Head Test</title>
  <style>
    #target {
      background-color: rgb(0, 128, 0);
    }
  </style>
</head>
<body>
  <div id="target">Styled via head style element</div>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target')
  await expect(target).toBeVisible()
  await expect(target).toHaveCSS('background-color', 'rgb(0, 128, 0)')
}
